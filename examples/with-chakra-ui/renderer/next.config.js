module.exports = {
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer'
    }
    return config
  },
  images: {
    unoptimized: true,
  },
}
