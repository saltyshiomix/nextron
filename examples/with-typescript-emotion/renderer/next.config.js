const withTypeScript = require('@zeit/next-typescript');

module.exports = withTypeScript({
  webpack: config => Object.assign(config, {
    target: 'electron-renderer',
  }),
  exportPathMap: async function () {
    return {
      '/home': { page: '/home' },
      '/next': { page: '/next' },
    };
  },
});
