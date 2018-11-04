const withTypeScript = require('@zeit/next-typescript')

module.exports = withTypeScript({
  webpack: (config) => {
    config.target = 'electron-renderer';
    config.module.rules.push({
      test: /\.node$/,
      use: 'native-ext-loader'
    });
    return config;
  },
  exportPathMap: async function () {
    return {
      '/calculator': { page: '/calculator' },
      '/home': { page: '/home' },
      '/next': { page: '/next' }
    }
  }
})
