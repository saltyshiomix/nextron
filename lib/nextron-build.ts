import fs from 'fs-extra'
import path from 'path'
import arg from 'arg'
import chalk from 'chalk'
import execa from 'execa'
import * as logger from './logger'
import { getNextronConfig } from './configs/getNextronConfig'

const args = arg({
  '--mac': Boolean,
  '--linux': Boolean,
  '--win': Boolean,
  '--x64': Boolean,
  '--ia32': Boolean,
  '--armv7l': Boolean,
  '--arm64': Boolean,
  '--universal': Boolean,
  '--config': String,
  '--publish': String,
  '--no-pack': Boolean,
})

const cwd = process.cwd()
const appDir = path.join(cwd, 'app')
const distDir = path.join(cwd, 'dist')
const rendererSrcDir = getNextronConfig().rendererSrcDir || 'renderer'
const execaOptions: execa.Options = {
  cwd,
  stdio: 'inherit',
}

;(async () => {
  // Ignore missing dependencies
  process.env.ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = 'true'

  try {
    logger.info('Clearing previous builds')
    await Promise.all([fs.remove(appDir), fs.remove(distDir)])

    logger.info('Building renderer process')
    await execa('next', ['build', path.join(cwd, rendererSrcDir)], execaOptions)
    await execa(
      'next',
      ['export', '-o', appDir, path.join(cwd, rendererSrcDir)],
      execaOptions
    )

    logger.info('Building main process')
    await execa(
      'node',
      [path.join(__dirname, 'webpack.config.js')],
      execaOptions
    )

    if (args['--no-pack']) {
      logger.info('Skip packaging...')
    } else {
      logger.info('Packaging - please wait a moment')
      await execa('electron-builder', createBuilderArgs(), execaOptions)
    }

    logger.info('See `dist` directory')
  } catch (err) {
    console.log(chalk`

{bold.red Cannot build electron packages:}
{bold.yellow ${err}}
`)
    process.exit(1)
  }
})()

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

  args['--mac'] && results.push('--mac')
  args['--linux'] && results.push('--linux')
  args['--win'] && results.push('--win')
  args['--x64'] && results.push('--x64')
  args['--ia32'] && results.push('--ia32')
  args['--armv7l'] && results.push('--armv7l')
  args['--arm64'] && results.push('--arm64')
  args['--universal'] && results.push('--universal')

  return results
}
