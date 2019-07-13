module.exports = {
  webpack: (config) => Object.assign(config, {
    target: 'electron-renderer',
  }),
  exportPathMap: async () => {
    return {
      '/home': { page: '/home' },
      '/calculator': { page: '/calculator' },
    };
  },
};
