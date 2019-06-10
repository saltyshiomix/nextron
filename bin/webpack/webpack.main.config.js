const { existsSync } = require('fs');
const { resolve } = require('path');
const { smart: merge } = require('webpack-merge');
const config = require('./webpack.base.config');

const tsEntry = resolve(process.cwd(), 'main', 'background.ts');
const jsEntry = resolve(process.cwd(), 'main', 'background.js');

const isTS = existsSync(resolve(process.cwd(), 'main', 'background.ts'));

module.exports = (env) =>
  merge(config(env), {
    entry: {
      background: isTS ? tsEntry : jsEntry,
    },
    output: {
      filename: '[name].js',
      path: resolve(process.cwd(), 'app'),
    },
  });
