const { existsSync } = require('fs');
const { join } = require('path');
const { smart: merge } = require('webpack-merge');
const config = require('./webpack.main.config');

const getUserConfig = () => {
  const userConfigPath = join(process.cwd(), 'nextron.config.js');
  if (existsSync(userConfigPath)) {
    return require(userConfigPath);
  } else {
    return {};
  }
};

const getWebpackConfig = (env) => {
  const defaultConfig = config(env);
  const webpackOverRide = getUserConfig().webpack || {};
  if (typeof webpackOverRide === 'function') {
    return webpackOverRide(defaultConfig, { dev: 'production' !== env, webpack });
  } else {
    return merge(defaultConfig, webpackOverRide);
  }
};

module.exports.getUserConfig = getUserConfig;
module.exports.getWebpackConfig = getWebpackConfig;
