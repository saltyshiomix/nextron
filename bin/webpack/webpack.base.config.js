const { resolve } = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const cwd = process.cwd();
const externals = require(resolve(cwd, 'package.json')).dependencies;

module.exports = (env) => ({
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
    modules: [resolve(cwd, 'app'), 'node_modules'],
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        exclude: [
          /node_modules/,
          resolve(cwd, 'renderer'),
        ],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-typescript'],
          },
        },
        exclude: [
          /node_modules/,
          resolve(cwd, 'renderer'),
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ],
});
