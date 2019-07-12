module.exports = {
  webpack: config => Object.assign(config, {
    target: 'electron-renderer',
  }),
  exportPathMap: async function () {
    return {
      '/calculator': { page: '/calculator' },
      '/home': { page: '/home' },
    };
  },
};
