import fs from 'fs-extra'
import path from 'path'
import { getNextronConfig } from './getNextronConfig'
import * as logger from '../logger'

const cwd = process.cwd()
const pkgPath = path.join(cwd, 'package.json')
const nextConfigPath = path.join(
  getNextronConfig().rendererSrcDir || 'renderer',
  'next.config.js'
)

export const useExportCommand = async (): Promise<boolean> => {
  const { dependencies, devDependencies } = await fs.readJSON(pkgPath)

  let nextronVersion: string
  nextronVersion = dependencies.nextron
  if (nextronVersion) {
    logger.info(
      'To reduce the bundle size of the electron app, we recommend placing nextron in devDependencies instead of dependencies.'
    )
  }
  if (!nextronVersion) {
    nextronVersion = devDependencies.nextron
    if (!nextronVersion) {
      logger.error(
        'Nextron not found in both dependencies and devDependencies.'
      )
      process.exit(1)
    }
  }

  logger.info(`nextronVersion ${nextronVersion}`)

  const majorVersion = ~~nextronVersion
    .split('.')
    .filter((v) => v.trim() !== '')[0]
    .replace('^', '')
    .replace('~', '')

  logger.info(`majorVersion ${majorVersion}`)
  if (majorVersion < 13) {
    return true
  }
  if (majorVersion === 13) {
    const { output } = await fs.readJSON(nextConfigPath)
    return output !== 'export'
  }
  if (majorVersion > 13 || majorVersion === 0) {
    const { output } = await fs.readJSON(nextConfigPath)
    if (output !== 'export') {
      logger.error(
        'We must export static files so as Electron can handle them. Please set next.config.js#output to "export".'
      )
      process.exit(1)
    }
    return false
  }

  logger.error('Unexpected error occerred')
  process.exit(1)
}
