import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const cwd = process.cwd();
const externals = require(path.join(cwd, 'package.json')).dependencies;

const getBabelrc = (): string | undefined => {
  if (fs.existsSync(path.join(cwd, '.babelrc'))) return path.join(cwd, '.babelrc');
  if (fs.existsSync(path.join(cwd, '.babelrc.js'))) return path.join(cwd, '.babelrc.js');
  if (fs.existsSync(path.join(cwd, 'babel.config.js'))) return path.join(cwd, 'babel.config.js');
  return path.join(__dirname, '../babel.js');
};

export default (env: 'development' | 'production'): webpack.Configuration => ({
  mode: env,
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [...Object.keys(externals || {})],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(cwd, 'app'), 'node_modules'],
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            extends: getBabelrc(),
          },
        },
        exclude: [
          /node_modules/,
          path.join(cwd, 'renderer'),
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
});
