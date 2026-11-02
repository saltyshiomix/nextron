import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cliPath =
  process.env.NEXTRON_TEST_CLI || path.join(root, 'bin/nextron.cjs')

type Event = {
  role: string
  pid: number
  port?: number
  revision?: string
  childPid?: number
}

// These commands use real processes and sockets without requiring an Electron
// download or a GUI. Webpack and the public Nextron CLI remain unmodified.
const commandSource = `
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const {spawn} = require('node:child_process');
const role = process.argv[2];
const append = event => fs.appendFileSync(process.env.NEXTRON_TEST_EVENTS,
  JSON.stringify({...event, pid: process.pid}) + '\\n');
if (role === 'electron') {
  append({role: 'wrapper'});
  const child = spawn(process.execPath, [path.join(process.cwd(), 'app/main.js')],
    {stdio: 'inherit', env: process.env, windowsHide: true});
  child.on('exit', code => process.exit(code === null ? 1 : code));
} else if (role === 'descendant') {
  append({role});
  setInterval(() => {}, 1000);
} else {
  const port = Number(process.argv[process.argv.indexOf('-p') + 1]);
  const server = net.createServer(socket => socket.on('data', data => {
    if (data.toString() === process.env.NEXTRON_TEST_TOKEN + ':quit') {
      socket.end();
      server.close(() => process.exit(0));
    } else { socket.end(); }
  }));
  server.listen(port, () => append({role: 'renderer', port}));
}
`

const mainSource = (revision: string) => `
const fs = require('node:fs');
const net = require('node:net');
const {spawn} = require('node:child_process');
const revision = '${revision}';
const append = event => fs.appendFileSync(process.env.NEXTRON_TEST_EVENTS,
  JSON.stringify({...event, pid: process.pid, revision}) + '\\n');
if (process.env.NEXTRON_TEST_FAIL === '1') {
  append({role: 'failed-app'});
  process.exit(7);
}
const child = spawn(process.execPath, [process.env.NEXTRON_TEST_COMMAND, 'descendant'],
  {stdio: 'inherit', env: process.env, windowsHide: true});
const server = net.createServer(socket => socket.on('data', data => {
  if (data.toString() === process.env.NEXTRON_TEST_TOKEN + ':quit') {
    socket.end();
    child.once('exit', () => server.close(() => process.exit(0)));
    child.kill();
  } else { socket.end(); }
}));
server.listen(0, '127.0.0.1', () => append({role: 'app', port: server.address().port, childPid: child.pid}));
`

function live(pid: number) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ESRCH') return false
    throw error
  }
}

async function freePort() {
  const server = net.createServer()
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const port = (server.address() as net.AddressInfo).port
  await new Promise<void>((resolve) => server.close(() => resolve()))
  return port
}

async function until(
  check: () => Promise<boolean> | boolean,
  description: string
) {
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    if (await check()) return
    await delay(50)
  }
  throw new Error(`Timed out waiting for ${description}`)
}

async function quit(port: number, token: string) {
  await new Promise<void>((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port }, () => {
      socket.end(`${token}:quit`)
    })
    socket.on('error', () => resolve())
    socket.on('close', () => resolve())
    socket.setTimeout(1000, () => socket.destroy())
  })
}

async function fixture(
  options: { runOnly?: boolean; fail?: boolean; signalControl?: boolean } = {}
) {
  // Resolve Windows short paths before webpack's filesystem watcher sees them.
  const temporary = await fs.realpath(os.tmpdir())
  const directory = await fs.mkdtemp(path.join(temporary, 'nextron-restart-'))
  assert.equal(path.dirname(directory), temporary)
  assert.ok(path.basename(directory).startsWith('nextron-restart-'))
  const marker = path.join(directory, 'events.jsonl')
  const command = path.join(directory, 'command.cjs')
  const token = randomUUID()
  const shims = path.join(directory, 'node_modules/.bin')
  const port = await freePort()
  await fs.mkdir(shims, { recursive: true })
  await fs.mkdir(path.join(directory, 'main'))
  await fs.mkdir(path.join(directory, 'renderer'))
  await fs.writeFile(marker, '')
  await fs.writeFile(command, commandSource)
  const signalControl = path.join(directory, 'signal-control.cjs')
  if (options.signalControl) {
    await fs.writeFile(
      signalControl,
      `const fs = require('node:fs');
const net = require('node:net');
const server = net.createServer(socket => socket.on('data', data => {
  if (data.toString() === process.env.NEXTRON_TEST_TOKEN + ':quit') process.emit('SIGINT');
  socket.end();
}));
server.listen(0, '127.0.0.1', () => fs.appendFileSync(process.env.NEXTRON_TEST_EVENTS,
  JSON.stringify({role: 'cli-control', pid: process.pid, port: server.address().port}) + '\\n'));
server.unref();\n`
    )
  }
  await fs.writeFile(
    path.join(directory, 'package.json'),
    '{"name":"restart-fixture"}'
  )
  await fs.writeFile(
    path.join(directory, 'main/main.js'),
    mainSource('initial')
  )
  await fs.writeFile(
    path.join(directory, 'main/preload.js'),
    'module.exports = {}\n'
  )
  await fs.writeFile(
    path.join(directory, 'nextron.config.js'),
    'module.exports = {webpack(config) {config.module.rules = []; return config}}\n'
  )
  for (const role of ['next', 'electron']) {
    await fs.writeFile(
      path.join(shims, `${role}.cmd`),
      `@echo off\r\n"${process.execPath}" "%~dp0..\\..\\command.cjs" ${role} %*\r\n`
    )
  }
  let output = ''
  const child = spawn(
    process.execPath,
    [
      ...(options.signalControl ? ['--require', signalControl] : []),
      cliPath,
      'dev',
      '--renderer-port',
      String(port),
      '--startup-delay',
      '10000',
      ...(options.runOnly ? ['--run-only'] : []),
    ],
    {
      cwd: directory,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PATH: `${shims}${path.delimiter}${process.env.PATH}`,
        NEXTRON_TEST_EVENTS: marker,
        NEXTRON_TEST_TOKEN: token,
        NEXTRON_TEST_COMMAND: command,
        NEXTRON_TEST_FAIL: options.fail ? '1' : '0',
      },
    }
  )
  child.stdout.on('data', (data) => (output += data))
  child.stderr.on('data', (data) => (output += data))
  const events = async (): Promise<Event[]> =>
    (await fs.readFile(marker, 'utf8'))
      .split('\n')
      .slice(0, -1)
      .filter(Boolean)
      .map((line) => JSON.parse(line))
  const wait = async (
    check: () => Promise<boolean> | boolean,
    description: string
  ) => {
    try {
      await until(check, description)
    } catch (error) {
      throw new Error(`${error}\nCLI output:\n${output}`, { cause: error })
    }
  }
  return {
    child,
    events,
    wait,
    change: (revision: string) =>
      fs.writeFile(path.join(directory, 'main/main.js'), mainSource(revision)),
    compiled: () => fs.readFile(path.join(directory, 'app/main.js'), 'utf8'),
    signal: async () => {
      const control = (await events()).find(
        (event) => event.role === 'cli-control'
      )!
      assert.equal(control.pid, child.pid)
      await quit(control.port!, token)
    },
    cleanup: async () => {
      // A failed baseline leaves orphaned app processes. Their private random
      // control tokens release them without killing any unrelated process.
      for (const event of await events()) {
        if (event.port && live(event.pid)) await quit(event.port, token)
      }
      if (child.exitCode === null && child.signalCode === null) {
        await delay(500)
        child.kill()
      }
      await wait(
        async () => (await events()).every((event) => !live(event.pid)),
        'all fixture processes to exit'
      )
      await fs.rm(directory, { recursive: true, force: true, maxRetries: 3 })
    },
  }
}

test(
  'rebuild replaces the main process and its descendants without ending dev',
  { skip: process.platform !== 'win32', timeout: 65000 },
  async () => {
    const run = await fixture()
    try {
      await run.wait(
        async () => (await run.events()).some((e) => e.role === 'app'),
        'initial app'
      )
      for (const revision of ['second', 'third']) {
        const previous = await run.events()
        const oldApps = previous.filter(
          (e) => e.role === 'app' || e.role === 'descendant'
        )
        await run.change(revision)
        await run.wait(
          async () =>
            (await run.events()).some(
              (e) => e.role === 'app' && e.revision === revision
            ),
          `${revision} app`
        )
        assert.equal(
          run.child.exitCode,
          null,
          'dev must survive intentional termination'
        )
        assert.equal(run.child.signalCode, null)
        assert.ok(
          oldApps.every((e) => !live(e.pid)),
          'old app and descendants must be gone'
        )
        assert.ok(
          oldApps.filter((e) => e.childPid).every((e) => !live(e.childPid!)),
          'the old app descendant must be gone even if its ready event was delayed'
        )
        const apps = (await run.events()).filter(
          (e) => e.role === 'app' && live(e.pid)
        )
        assert.equal(apps.length, 1, 'only the current app may remain')
        assert.equal(apps[0].revision, revision)
        assert.ok(
          !oldApps.some((e) => e.pid === apps[0].pid),
          'rebuild must create a new process'
        )
      }
    } finally {
      await run.cleanup()
    }
  }
)

test(
  '--run-only compiles changes while retaining the original app',
  { skip: process.platform !== 'win32', timeout: 35000 },
  async () => {
    const run = await fixture({ runOnly: true })
    try {
      await run.wait(
        async () => (await run.events()).some((e) => e.role === 'app'),
        'initial app'
      )
      const first = (await run.events()).find((e) => e.role === 'app')!
      await run.change('second')
      await run.wait(
        async () =>
          (await run.compiled()).includes("const revision = 'second'"),
        'changed bundle'
      )
      await delay(500)
      assert.equal(
        (await run.events()).filter((e) => e.role === 'app').length,
        1
      )
      assert.ok(live(first.pid))
      assert.equal(run.child.exitCode, null)
    } finally {
      await run.cleanup()
    }
  }
)

test(
  'a real main-process failure exits unsuccessfully and releases the renderer',
  { skip: process.platform !== 'win32', timeout: 35000 },
  async () => {
    const run = await fixture({ fail: true })
    try {
      await run.wait(() => run.child.exitCode !== null, 'failed CLI to exit')
      assert.equal(run.child.exitCode, 1)
      const events = await run.events()
      assert.equal(events.filter((e) => e.role === 'failed-app').length, 1)
      assert.ok(events.some((e) => e.role === 'renderer'))
      assert.ok(
        events.filter((e) => e.role === 'renderer').every((e) => !live(e.pid))
      )
    } finally {
      await run.cleanup()
    }
  }
)

test(
  'the SIGINT handler finishes cleanup after a main source change',
  { skip: process.platform !== 'win32', timeout: 35000 },
  async () => {
    const run = await fixture({ signalControl: true })
    try {
      await run.wait(
        async () => (await run.events()).some((event) => event.role === 'app'),
        'initial app'
      )
      await run.change('second')
      // Node's Windows child.kill('SIGINT') forcibly terminates the process.
      // Inject the event to exercise the registered asynchronous handler instead.
      await run.signal()
      await run.wait(
        () => run.child.exitCode !== null,
        'signal cleanup to finish'
      )
      assert.equal(run.child.exitCode, 0)
      assert.ok(
        (await run.events()).every((event) => !live(event.pid)),
        'all owned processes must exit before fixture cleanup'
      )
    } finally {
      await run.cleanup()
    }
  }
)
