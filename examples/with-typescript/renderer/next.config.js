const withTypeScript = require('@zeit/next-typescript')

module.exports = withTypeScript({
  webpack: (config) => {
    config.target = 'electron-renderer'
    return config
  },
  exportPathMap: async function () {
    return {
      '/home': { page: '/home' },
      '/next': { page: '/next' }
    }
  }
})
