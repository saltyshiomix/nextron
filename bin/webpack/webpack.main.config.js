const { existsSync } = require('fs');
const { resolve } = require('path');
const { smart: merge } = require('webpack-merge');
const config = require('./webpack.base.config');

const cwd = process.cwd();
const isTS = existsSync(resolve(cwd, 'tsconfig.json'));
const entry = resolve(cwd, `main/background.${isTS ? 'ts' : 'js'}`);

module.exports = (env) =>
  merge(config(env), {
    entry: {
      background: entry,
    },
    output: {
      filename: '[name].js',
      path: resolve(cwd, 'app'),
    },
  });
