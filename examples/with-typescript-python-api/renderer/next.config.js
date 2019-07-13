module.exports = {
  webpack: (config) => Object.assign(config, {
    target: 'electron-renderer',
  }),
  exportPathMap: async () => {
    return {
      '/calculator': { page: '/calculator' },
      '/home': { page: '/home' },
    };
  },
};
