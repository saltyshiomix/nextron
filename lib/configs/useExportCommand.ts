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

  let nextVersion: string
  nextVersion = dependencies.next
  if (nextVersion) {
    logger.info(
      'To reduce the bundle size of the electron app, we recommend placing next and nextron in devDependencies instead of dependencies.'
    )
  }
  if (!nextVersion) {
    nextVersion = devDependencies.next
    if (!nextVersion) {
      logger.error('Next not found in both dependencies and devDependencies.')
      process.exit(1)
    }
  }

  const majorVersion = ~~nextVersion
    .split('.')
    .filter((v) => v.trim() !== '')[0]
    .replace('^', '')
    .replace('~', '')

  logger.info(`next's majorVersion: v${majorVersion}`)
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
