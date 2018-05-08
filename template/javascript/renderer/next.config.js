module.exports = {
  webpack: (config, options) => {
    config.target = 'electron-renderer'
    return config
  }
}
