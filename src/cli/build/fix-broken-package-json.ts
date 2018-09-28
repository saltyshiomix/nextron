import { readJson, writeJson } from 'fs-extra'
import { join } from 'path'
import * as fg from 'fast-glob'

export default async function fixBrokenPakageJson(): Promise<void> {
  const files: string[] = fg.sync(join(process.cwd(), '**/JSV/*'))
  files.forEach(async (file: string) => {
    if (file.endsWith('package.json')) {
      await writeJson(file, {
        ...await readJson(file),
        dependencies: {}
      })
    }
  })
}
