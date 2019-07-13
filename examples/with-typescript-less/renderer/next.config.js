const withLess = require('@zeit/next-less');

module.exports = withLess({
  webpack: (config) => Object.assign(config, {
    target: 'electron-renderer',
  }),
  exportPathMap: async () => {
    return {
      '/home': { page: '/home' },
      '/next': { page: '/next' },
    };
  },
});
