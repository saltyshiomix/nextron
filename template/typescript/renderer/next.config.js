const withTypescript = require('@zeit/next-typescript')
module.exports = withTypescript({
  webpack: (config, options) => {
    confit.target = 'electron-renderer'
    return config
  }
})
