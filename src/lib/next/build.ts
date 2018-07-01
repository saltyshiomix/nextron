import { execSync } from 'child_process'
import { join, sep } from 'path'
import { copy, remove } from 'fs-extra'

export default async function build(rendererDir: string): Promise<void> {
  const cwd: string = process.cwd()
  const outdir: string = join(cwd, rendererDir, 'out')
  execSync(`node_modules${sep}.bin${sep}next build ${rendererDir}`, { cwd })
  execSync(`node_modules${sep}.bin${sep}next export ${rendererDir}`, { cwd })
  await copy(outdir, join(cwd, 'app'))
  await remove(outdir)
}
