module.exports = {
  webpack: (config) => {
    config.target = 'electron-renderer';

    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        name: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });

    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;

    return config;
  },
};
