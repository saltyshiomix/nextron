import fs from 'fs';
import path from 'path';
import merge from 'webpack-merge';
import configure from './webpack.config';

const cwd = process.cwd();
const ext = fs.existsSync(path.join(cwd, 'tsconfig.json')) ? '.ts' : '.js';

const getNextronConfig = () => {
  const nextronConfigPath = path.join(cwd, 'nextron.config.js');
  if (fs.existsSync(nextronConfigPath)) {
    return require(nextronConfigPath);
  } else {
    return {};
  }
};

const getWebpackConfig = (env: 'development' | 'production') => {
  const { mainSrcDir, webpack } = getNextronConfig();
  const userConfig = merge(configure(env), {
    entry: {
      background: path.join(cwd, mainSrcDir || 'main', `background${ext}`),
    },
    output: {
      filename: '[name].js',
      path: path.join(cwd, 'app'),
    },
  });

  const userWebpack = webpack || {};
  if (typeof userWebpack === 'function') {
    return userWebpack(userConfig, env);
  } else {
    return merge(userConfig, userWebpack);
  }
};

export {
  getNextronConfig,
  getWebpackConfig,
};
