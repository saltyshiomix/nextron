import { join } from 'path'
import * as fs from 'fs-extra'
import buildMainProcess from '../../lib/build-main-process'
import buildRendererProcess from '../../lib/build-renderer-process'
import packageElectron from '../../lib/package-electron'
import * as spinner from '../spinner'

export default async function build() {
  const cwd = process.cwd()

  try {
    spinner.create('Clearing previous builds')
    await fs.remove(join(cwd, 'app'))
    await fs.remove(join(cwd, 'dist'))

    spinner.create('Building renderer process')
    await buildRendererProcess('renderer')

    spinner.create('Building main process')
    await buildMainProcess()

    spinner.create('Packaging - please wait a moment')
    console.log('')
    await packageElectron()

    spinner.clear('See `dist` directory')
  } catch (err) {
    spinner.fail('Cannot build electron packages. Please contact <shiono.yoshihide@gmail.com>.')
    console.log(err)
    process.exit(1)
  }
}
