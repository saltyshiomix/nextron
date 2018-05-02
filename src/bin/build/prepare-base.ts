import { dirname, resolve } from 'path'
import { ensureDir, copy } from 'fs-extra'
import * as spinner from '../../spinner'

export default async function prepareBase(output: string): Promise<void> {
  const modules = resolve(process.cwd(), 'node_modules')
  let index

  try {
    index = require.resolve('electron', {
      paths: [ modules ]
    })
  } catch (err) {
    spinner.fail('The "electron" dependency is not installed')
    return
  }

  const isWin = process.platform === 'win32'
  const suffix = isWin ? '' : 'Electron.app'
  const name = Boolean(suffix) ? suffix : 'electron'
  const location = resolve(dirname(index), 'dist', suffix)

  await ensureDir(output)
  await copy(location, resolve(output, name))
}
