const withTypeScript = require('@zeit/next-typescript')
const { detectExportPathMap } = require('nextron')

module.exports = withTypeScript({
  webpack: (config) => {
    config.target = 'electron-renderer'
    return config
  },
  exportPathMap: detectExportPathMap
})
