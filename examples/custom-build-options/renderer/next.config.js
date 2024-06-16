/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  distDir: '../app',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}
