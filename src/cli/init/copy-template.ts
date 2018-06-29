import * as fs from 'fs-extra'
import * as spinner from '../../spinner'

export default async function copyTemplate(templatePath: string, targetPath: string): Promise<void> {
  spinner.create('Set up templates')
  await fs.copy(templatePath, targetPath)
}
