const { existsSync } = require('fs');
const { join } = require('path');
const { smart: merge } = require('webpack-merge');
const config = require('./webpack.config');

const cwd = process.cwd();
const ext = existsSync(join(cwd, 'tsconfig.json')) ? '.ts' : '.js';

const getNextronConfig = () => {
  const nextronConfigPath = join(cwd, 'nextron.config.js');
  if (existsSync(nextronConfigPath)) {
    return require(nextronConfigPath);
  } else {
    return {};
  }
};

const getWebpackConfig = (env) => {
  const { mainSrcDir, webpack } = getNextronConfig();
  const userConfig = merge(config(env), {
    entry: {
      background: join(cwd, mainSrcDir || 'main', `background${ext}`),
    },
    output: {
      filename: '[name].js',
      path: join(cwd, 'app'),
    },
  });

  const userWebpack = webpack || {};
  if (typeof userWebpack === 'function') {
    return userWebpack(userConfig, env);
  } else {
    return merge(userConfig, userWebpack);
  }
};

module.exports.getNextronConfig = getNextronConfig;
module.exports.getWebpackConfig = getWebpackConfig;
