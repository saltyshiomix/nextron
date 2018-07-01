import { resolve } from 'path'
import * as fs from 'fs-extra'
import * as spinner from '../spinner'

export default async function setMetaInformation(targetPath: string, name: string): Promise<void> {
  spinner.create('Set meta information')

  const path = resolve(targetPath, 'package.json')
  const content = await fs.readJSON(path)
  content.name = name
  if (process.env.NODE_ENV === 'testing') {
    content.dependencies['nextron'] = resolve(__dirname, '../../..')
  }

  await fs.writeJSON(path, {...content}, {spaces: 2})
}
