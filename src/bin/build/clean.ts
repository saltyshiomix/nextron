import { pathExists, remove } from 'fs-extra'
import * as spinner from '../../spinner'

export default async function clean(directory: string): Promise<void> {
  if (!await pathExists(directory)) {
    return
  }

  spinner.create('Cleaning up previous build')

  try {
    await remove(directory)
  } catch (err) {
    spinner.fail('Not able to clean up output directory')
  }
}
