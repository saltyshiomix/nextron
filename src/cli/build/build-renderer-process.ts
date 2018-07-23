import { spawn } from 'cross-spawn'
import { join } from 'path'
import { copy, remove, readFileSync, writeFileSync } from 'fs-extra'
import * as fg from 'fast-glob'
import detectBinPath from '../../lib/util/detect-bin-path'
import resolveExportedPaths from '../../lib/next/resolve-exported-paths'

export default async function buildRendererProcess(rendererDir: string): Promise<void> {
  const cwd: string = process.cwd()
  const outdir: string = join(cwd, rendererDir, 'out')
  const appdir: string = join(cwd, 'app')

  const next: string = detectBinPath('next')
  spawn.sync(next, ['build', rendererDir], { cwd })
  spawn.sync(next, ['export', rendererDir], { cwd })
  await copy(outdir, appdir)
  await remove(outdir)

  const pages: string[] = fg.sync(join(appdir, '**/*.html'))
  pages.forEach(page => {
  	writeFileSync(page, resolveExportedPaths(readFileSync(page).toString()))
  })
}
