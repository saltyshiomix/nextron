/* eslint-disable @typescript-eslint/no-unused-expressions */

import fs from 'fs-extra'
import path from 'path'
import { Command } from 'commander'
import chalk from 'chalk'
import { $ } from 'execa'
import * as logger from './logger'
import { checkNextConfig } from './helpers/check-next-config'
import { getNextronConfig } from './helpers/get-nextron-config'

type BuildCommandOptions = {
  mac: boolean
  linux: boolean
  win: boolean
  x64: boolean
  ia32: boolean
  armv7l: boolean
  arm64: boolean
  universal: boolean
  config: string
  publish: string
  pack: boolean // `--no-pack` option
}

export const buildCommand = new Command('build')

buildCommand
  .option('--mac')
  .option('--linux')
  .option('--win')
  .option('--x64')
  .option('--ia32')
  .option('--armv7l')
  .option('--arm64')
  .option('--universal')
  .option('--config <string>')
  .option('--publish <string>')
  .option('--no-pack')
  .action(async (options: BuildCommandOptions) => {
    const cwd = process.cwd()
    const appDir = path.join(cwd, 'app')
    const distDir = path.join(cwd, 'dist')
    const $$ = $({ cwd, stdio: 'inherit' })

    function createBuilderArgs() {
      const results = []

      if (options.config) {
        results.push('--config')
        results.push(options.config || 'electron-builder.yml')
      }

      if (options.publish) {
        results.push('--publish')
        results.push(options.publish)
      }

      options.mac && results.push('--mac')
      options.linux && results.push('--linux')
      options.win && results.push('--win')
      options.x64 && results.push('--x64')
      options.ia32 && results.push('--ia32')
      options.armv7l && results.push('--armv7l')
      options.arm64 && results.push('--arm64')
      options.universal && results.push('--universal')

      return results
    }

    // Ignore missing dependencies
    process.env.ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = 'true'

    const rendererSrcDir = path.join(
      cwd,
      (await getNextronConfig()).rendererSrcDir || 'renderer'
    )

    try {
      logger.info('Checking next config')
      await checkNextConfig()

      logger.info('Clearing previous builds')
      await Promise.all([fs.remove(appDir), fs.remove(distDir)])

      logger.info('Building renderer process')
      await $$('next', ['build', rendererSrcDir])

      logger.info('Building main process')
      await $$('node', [path.join(import.meta.dirname, 'webpack.config.cjs')])

      if (options.pack) {
        logger.info('Packaging - please wait a moment')
        await $$('electron-builder', createBuilderArgs())
        logger.info('See `dist` directory')
      } else {
        logger.info('Skip packaging!')
      }
    } catch (err) {
      console.log(`

${chalk.red('Cannot build electron packages:')}
${chalk.yellow(err)}
`)
      process.exit(1)
    }
  })
