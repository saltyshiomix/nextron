module.exports = {
  webpack: config => Object.assign(config, {
    target: 'electron-renderer',
  }),
  exportPathMap: async function () {
    return {
      '/home': { page: '/home' },
      '/blog/first': { page: '/blog', query: { id: 'first' } },
      '/blog/second': { page: '/blog', query: { id: 'second' } },
      '/blog/last': { page: '/blog', query: { id: 'last' } },
    };
  },
};
