const { resolve } = require('path');
const { smart: merge } = require('webpack-merge');
const base = require('./webpack.base.config');

module.exports = (env) => merge(base(env), {
  entry: {
    background: './main/background.js',
  },
  output: {
    filename: '[name].js',
    path: resolve(process.cwd(), 'app'),
  },
});
