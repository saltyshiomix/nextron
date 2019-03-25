const withTypeScript = require('@zeit/next-typescript');
const withLess = require('@zeit/next-less');

module.exports = withTypeScript(withLess({
  webpack: config => Object.assign(config, {
    target: 'electron-renderer',
  }),
  exportPathMap: async function () {
    return {
      '/home': { page: '/home' },
      '/next': { page: '/next' },
    };
  },
}));
