module.exports = {
  webpack: (defaultConfig) =>
    Object.assign(defaultConfig, {
      entry: {
        background: './main/background.ts',
        preload: './main/preload.ts',
      },
    }),
}
