import * as fs from 'fs-extra'
import * as spinner from '../../spinner'

export default async function existsPath(targetPath: string, name: string): Promise<void> {
  if (!await fs.pathExists(targetPath)) {
    return
  }

  const overwrite = await spinner.prompt(`Directory "${name}" already exists. Overwrite?`)
  if (!overwrite) {
    spinner.clear('No action was taken')
    process.exit(0)
  }
}
