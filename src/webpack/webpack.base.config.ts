import { resolve } from 'path'
import * as nodeExternals from 'webpack-node-externals'
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'

export default function config(env: string, ext: 'js'|'ts') {
  const baseConfig = {
    target: 'electron-renderer',
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    devtool: 'source-map',
    resolve: {
      extensions: ['.js'],
      alias: {
        env: resolve(process.cwd(), `env/${env}.json`)
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: [
            /node_modules/,
            resolve(process.cwd(), 'renderer')
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === 'development' })
    ]
  }

  if (ext === 'ts') {
    baseConfig.resolve.extensions.push('ts')
    baseConfig.module.rules.push({
      test: /\.tsx?$/,
      use: ['awesome-typescript-loader'],
      exclude: [
        /node_modules/,
        resolve(process.cwd(), 'renderer')
      ]
    })
  }

  return baseConfig
}
