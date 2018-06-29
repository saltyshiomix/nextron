import { join } from 'path'
import * as fs from 'fs-extra'
import * as spinner from '../../spinner'

export default async function setAppName(targetPath: string, name: string): Promise<void> {
  spinner.create('Set up meta information')

  const path = join(targetPath, 'package.json')
  const content = await fs.readJSON(path)

  await fs.writeJSON(path, {
    ...content,
    name
  }, {
    spaces: 2
  })
}
