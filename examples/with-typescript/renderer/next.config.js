const withTypescript = require('@zeit/next-typescript')
module.exports = withTypescript({
  webpack: (config, options) => {
    config.target = 'electron-renderer'
    return config
  }
})
