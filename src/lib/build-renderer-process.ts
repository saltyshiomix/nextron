import { execSync } from 'child_process'
import { join, sep } from 'path'
import { copy, remove, readFileSync, writeFileSync } from 'fs-extra'
import * as fg from 'fast-glob'
import resolveExportedPaths from './next/resolve-exported-paths'
import detectPM from './detect-pm'

export default async function buildRendererProcess(rendererDir: string): Promise<void> {
  const pm: 'yarn'|'npm' = await detectPM()
  const cwd: string = process.cwd()
  const outdir: string = join(cwd, rendererDir, 'out')
  const appdir: string = join(cwd, 'app')

  let next: string
  if (process.env.NODE_ENV === 'testing') {
    next = pm === 'yarn' ? `node_modules${sep}.bin${sep}next` : `node_modules${sep}nextron${sep}node_modules${sep}.bin${sep}next`
  } else {
    next = `node_modules${sep}.bin${sep}next`
  }
  execSync(`${next} build ${rendererDir}`, { cwd })
  execSync(`${next} export ${rendererDir}`, { cwd })
  await copy(outdir, appdir)
  await remove(outdir)

  const pages: string[] = fg.sync(join(appdir, '**/*.html'))
  pages.forEach(page => {
  	writeFileSync(page, resolveExportedPaths(readFileSync(page).toString()))
  })
}
