module.exports = {
  webpack: (defaultConfig, env) => Object.assign(defaultConfig, {
    entry: {
      background: './main/background.js',
      config: './main/config.js',
    },
  }),
};
