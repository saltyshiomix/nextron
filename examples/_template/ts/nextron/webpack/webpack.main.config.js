const { resolve } = require('path');
const { smart: merge } = require('webpack-merge');
const config = require('./webpack.base.config');

module.exports = (env) => merge(config(env), {
  entry: {
    background: './main/background.ts',
  },
  output: {
    filename: '[name].js',
    path: resolve(process.cwd(), 'app'),
  },
});
