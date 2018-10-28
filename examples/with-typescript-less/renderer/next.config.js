const withTypeScript = require('@zeit/next-typescript')
const withLess = require('@zeit/next-less')

module.exports = withTypeScript(withLess({
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
}))
