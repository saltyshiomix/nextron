const { join, extname } = require('path')
const fg = require('fast-glob')

function detectExportPathMap() {
  const cwd = process.cwd()
  const pagesVirtualPath = 'renderer/pages'

  let pages = fg.sync(join(cwd, pagesVirtualPath, '**/*'))
  const pagesDir = join(cwd, pagesVirtualPath).replace(/\\/g, '/')
  pages = pages.map(f => f.replace(pagesDir, '').replace(extname(f), ''))

  const maps = {}
  pages.forEach(page => {
    if (!page.startsWith('/_')) {
      maps[page] = { page: page }
    }
  })

  return maps
}

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {}
}

const withCss = require('@zeit/next-css')

module.exports = withCss({
  webpack: (config) => {
    config.target = 'electron-renderer'
    return config
  },
  exportPathMap: detectExportPathMap
})
