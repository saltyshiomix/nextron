import { resolve, basename } from 'path'
import { remove } from 'fs-extra'
import getConfig from './get-config'
import exportRenderer from './export-renderer'
import clean from './clean'
import prepareBase from './prepare-base'
import setInfo from './set-info'
import createBundle from './create-bundle'
import compress from './compress'
import createInstaller from './create-installer'
import * as spinner from '../../spinner'

export default async function build() {
  const cwd = process.cwd()
  const { CI } = process.env
  const isTTY = CI ? false : process.stdout.isTTY
  const output = resolve(cwd, 'out')
  const config = await getConfig(cwd)

  await exportRenderer()
  await clean(output)
  await prepareBase(output)
  await setInfo(output, config)
  const bundle = await createBundle(cwd, output, config)
  await compress(output, bundle, config)
  await createInstaller(output, bundle, config, cwd)
  await remove(bundle)

  const directory = basename(output)
  let finalNotice = `You can find your bundled app in "${directory}"`

  if (!isTTY) {
    process.stdout.write('\n')
  }

  spinner.clear(finalNotice)
}
