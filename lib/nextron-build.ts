import fs from 'fs-extra'
import path from 'path'
import arg from 'arg'
import chalk from 'chalk'
import execa from 'execa'
import { getNextronConfig, log } from './helpers'

const args = arg({
  '--all': Boolean,
  '--win': Boolean,
  '--mac': Boolean,
  '--linux': Boolean,
  '--x64': Boolean,
  '--ia32': Boolean,
  '--armv7l': Boolean,
  '--arm64': Boolean,
  '--universal': Boolean,
  '--config': String,
  '--publish': String,
  '--no-pack': Boolean,
  '-w': '--win',
  '-m': '--mac',
  '-l': '--linux',
  '-c': '--config',
  '-p': '--publish',
})

const cwd = process.cwd()
const execaOptions: execa.Options = {
  cwd,
  stdio: 'inherit',
}

async function build() {
  // Ignore missing dependencies
  process.env.ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = 'true'

  const appdir = path.join(cwd, 'app')
  const distdir = path.join(cwd, 'dist')
  const rendererSrcDir = getNextronConfig().rendererSrcDir || 'renderer'

  try {
    log('Clearing previous builds')
    fs.removeSync(appdir)
    fs.removeSync(distdir)

    log('Building renderer process')
    await execa('next', ['build', path.join(cwd, rendererSrcDir)], execaOptions)
    await execa(
      'next',
      ['export', '-o', appdir, path.join(cwd, rendererSrcDir)],
      execaOptions
    )

    log('Building main process')
    await execa(
      'node',
      [path.join(__dirname, 'webpack.config.js')],
      execaOptions
    )

    if (args['--no-pack']) {
      log('Skip Packaging...')
    } else {
      log('Packaging - please wait a moment')
      await execa('electron-builder', createBuilderArgs(), execaOptions)
    }

    log('See `dist` directory')
  } catch (err) {
    console.log(chalk`

{bold.red Cannot build electron packages:}
{bold.yellow ${err}}
`)
    process.exit(1)
  }
}

function createBuilderArgs() {
  const results = []
  if (args['--config']) {
    results.push('--config')
    results.push(args['--config'] || 'electron-builder.yml')
  }
  if (args['--publish']) {
    results.push('--publish')
    results.push(args['--publish'])
  }
  if (args['--all']) {
    results.push('-wml')
    results.push(...createArchArgs())
  } else {
    args['--win'] && results.push('--win')
    args['--mac'] && results.push('--mac')
    args['--linux'] && results.push('--linux')
    results.push(...createArchArgs())
  }
  return results
}

function createArchArgs() {
  const archArgs = []
  args['--x64'] && archArgs.push('--x64')
  args['--ia32'] && archArgs.push('--ia32')
  args['--armv7l'] && archArgs.push('--armv7l')
  args['--arm64'] && archArgs.push('--arm64')
  args['--universal'] && archArgs.push('--universal')
  return archArgs
}

build()
