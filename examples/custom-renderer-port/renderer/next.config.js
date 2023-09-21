module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer'
    }

    return config
  },
}
