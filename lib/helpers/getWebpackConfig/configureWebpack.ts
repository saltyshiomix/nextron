import path from 'path'
import webpack from 'webpack'
import { getBabelConfig } from './getBabelConfig'

const cwd = process.cwd()
// eslint-disable-next-line @typescript-eslint/no-var-requires
const externals = require(path.join(cwd, 'package.json')).dependencies

export const configureWebpack = (
  env: 'development' | 'production'
): webpack.Configuration => ({
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
            extends: getBabelConfig(),
          },
        },
        exclude: [/node_modules/, path.join(cwd, 'renderer')],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: env,
    }),
  ],
})
