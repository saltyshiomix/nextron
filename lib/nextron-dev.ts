import { ChildProcess } from 'child_process'
import arg from 'arg'
import chalk from 'chalk'
import execa from 'execa'
import webpack from 'webpack'
import { getNextronConfig, getWebpackConfig } from './webpack/helpers'

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '--port': Number,
  '--remote-debugging-port': Number,
  '--inspect': Number,
  '--run-only': Boolean,
  '--startup-delay': Number,
  '-h': '--help',
  '-v': '--version',
  '-p': '--port',
  '-r': '--run-only',
  '-d': '--startup-delay',
})

if (args['--help']) {
  console.log(chalk`
    {bold.cyan nextron dev} - Starts the nextron application in development mode

    {bold USAGE}

      {bold $} {cyan nextron dev} --help
      {bold $} {cyan nextron dev} [options]

    {bold OPTIONS}

      --help,                 -h  show this help message
      --version,              -v  display the current version of nextron
      --port,                 -p  renderer port number for development mode
      --remote-debugging-port
      --inspect
      --run-only,             -r  ignore webpack watching of main process
      --startup-delay,        -d  wait milliseconds until renderer process is ready to use
  `)
  process.exit(0)
}

const nextronConfig = getNextronConfig()

const rendererPort = args['--port'] || 8888
const remoteDebuggingPort = args['--remote-debugging-port'] || 5858
const inspectPort = args['--inspect'] || 9292
const startupDelay = nextronConfig.startupDelay || args['--startup-delay'] || 0

const execaOptions: execa.Options = {
  cwd: process.cwd(),
  stdio: 'inherit',
}

async function dev() {
  let firstCompile = true
  let watching: webpack.Watching
  let mainProcess: ChildProcess
  let rendererProcess: ChildProcess // eslint-disable-line prefer-const

  const startMainProcess = () => {
    mainProcess = execa(
      'electron',
      [
        '.',
        `${rendererPort}`,
        `--remote-debugging-port=${remoteDebuggingPort}`,
        `--inspect=${inspectPort}`,
      ],
      {
        detached: true,
        ...execaOptions,
      }
    )
    mainProcess.unref()
  }

  const startRendererProcess = () => {
    const child = execa(
      'next',
      ['-p', rendererPort, nextronConfig.rendererSrcDir || 'renderer'],
      execaOptions
    )
    child.on('close', () => {
      process.exit(0)
    })
    return child
  }

  const killWholeProcess = () => {
    if (watching) {
      watching.close(() => {})
    }
    if (mainProcess) {
      mainProcess.kill()
    }
    if (rendererProcess) {
      rendererProcess.kill()
    }
  }

  const webpackCallback = async (err?: Error | null) => {
    if (err) {
      console.error(err.stack || err)
      if (err.stack) {
        console.error(err.stack)
      }
    }

    if (firstCompile) {
      firstCompile = false
    }

    if (!err) {
      if (!firstCompile && mainProcess) {
        mainProcess.kill()
      }
      startMainProcess()
    }
  }

  process.on('SIGINT', killWholeProcess)
  process.on('SIGTERM', killWholeProcess)
  process.on('exit', killWholeProcess)

  rendererProcess = startRendererProcess()

  // wait until renderer process is ready
  await new Promise<void>((resolve) =>
    setTimeout(() => resolve(), startupDelay)
  )

  const compiler = webpack(getWebpackConfig('development'))
  if (args['--run-only']) {
    compiler.run(webpackCallback)
  } else {
    watching = compiler.watch({}, webpackCallback)
  }
}

dev()
