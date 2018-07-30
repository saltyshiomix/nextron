import { join } from 'path'
import { copy, remove, readFileSync, writeFileSync } from 'fs-extra'
import { npxSync as npx } from 'node-npx'
import * as fg from 'fast-glob'
import resolveExportedPaths from '../../lib/next/resolve-exported-paths'

export default async function buildRendererProcess(rendererDir: string): Promise<void> {
  const cwd: string = process.cwd()
  const outdir: string = join(cwd, rendererDir, 'out')
  const appdir: string = join(cwd, 'app')

  await npx('next', ['build', rendererDir], { cwd })
  await npx('next', ['export', rendererDir], { cwd })
  await copy(outdir, appdir)
  await remove(outdir)

  const pages: string[] = fg.sync(join(appdir, '**/*.html'))
  pages.forEach(page => {
  	writeFileSync(page, resolveExportedPaths(readFileSync(page).toString()))
  })
}
