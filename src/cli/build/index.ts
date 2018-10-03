import { join } from 'path'
import * as fs from 'fs-extra'
import buildMainProcess from './build-main-process'
import buildRendererProcess from './build-renderer-process'
import packageElectron from './package-electron'
import createBuilderArgs from './create-builder-args'
import * as spinner from '../spinner'

export default async function build(argv: any) {
  // nextron has peer dependencies like typescript by ts-loader
  process.env.ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = true

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
    await packageElectron(createBuilderArgs(argv))

    spinner.clear('See `dist` directory')
  } catch (err) {
    spinner.fail('Cannot build electron packages. Please contact <shiono.yoshihide@gmail.com>.')
    console.log(err)
    process.exit(1)
  }
}
