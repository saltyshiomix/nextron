module.exports = {
  webpack: config => Object.assign(config, {
    target: 'electron-renderer'
  }),
  exportPathMap: async function () {
    return {
      '/home': { page: '/home' },
      '/about': { page: '/about' }
    }
  }
}
