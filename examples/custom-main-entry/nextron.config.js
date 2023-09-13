module.exports = {
  webpack: (defaultConfig) =>
    Object.assign(defaultConfig, {
      entry: {
        background: './main/app.js',
      },
    }),
}
