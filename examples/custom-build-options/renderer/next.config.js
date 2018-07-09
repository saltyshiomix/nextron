const { detectExportPathMap } = require('nextron')

module.exports = {
  webpack: (config) => {
    config.target = 'electron-renderer'
    return config
  },
  exportPathMap: detectExportPathMap()
}
