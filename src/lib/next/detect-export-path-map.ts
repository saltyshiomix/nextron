import { join, extname } from 'path'
import * as fg from 'fast-glob'

export default function getExportPathMaps() {
  const cwd: string = process.cwd()
  const pagesVirtualPath: string = 'src/cli'

  let pages: string[] = fg.sync(join(cwd, pagesVirtualPath, '**/*'))
  const pagesDir: string = join(cwd, pagesVirtualPath).replace(/\\/g, '/')
  pages = pages.map(f => f.replace(pagesDir, '').replace(extname(f), ''))

  const maps = {}
  pages.forEach(page => {
    maps[page] = { page: page }
  })

  return maps
}
