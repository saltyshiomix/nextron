module.exports = {
  webpack: (defaultConfig, env) => Object.assign(defaultConfig, {
    entry: {
      background: './main/background-with-python-api.ts',
    },
  }),
};
