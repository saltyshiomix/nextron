import { existsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import * as webpack from 'webpack'
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'

const cwd: string = process.cwd()
const externals: object = require(resolve(cwd, 'package.json')).dependencies
const possibleExternals: object = require(resolve(__dirname, '../../../package.json')).dependencies

function filterDepWithoutEntryPoints(dep: string): boolean {
  try {
    if (existsSync(join(__dirname, `node_modules/${dep}/index.js`))) {
      return false
    }
    const pgkString = readFileSync(join(__dirname, `node_modules/${dep}/package.json`)).toString()
    const pkg = JSON.parse(pgkString)
    const fields = ['main', 'module', 'jsnext:main', 'browser']
    return !fields.some(field => field in pkg)
  } catch (_) {
    return true
  }
}

export default function config(env: string, ext: 'js'|'ts') {
  const baseConfig = {
    mode: env,
    target: 'electron-main',
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [
      ...Object.keys(externals || {}),
      ...Object.keys(possibleExternals || {}).filter(filterDepWithoutEntryPoints)
    ],
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      alias: {
        env: resolve(cwd, `env/${env}.json`)
      },
      modules: [join(cwd, 'app'), 'node_modules']
    },
    output: {
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          exclude: [
            /node_modules/,
            resolve(cwd, 'renderer')
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: env
      }),
      new webpack.NamedModulesPlugin(),
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === 'development' })
    ]
  }

  if (ext === 'ts') {
    baseConfig.resolve.extensions.push('.ts', '.tsx')
    baseConfig.module.rules.push({
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: [
        /node_modules/,
        resolve(process.cwd(), 'renderer')
      ]
    })
  }

  if (env === 'production') {
    baseConfig.plugins.push(new UglifyJSPlugin({
      parallel: true,
      sourceMap: true
    }))
    baseConfig.plugins.push(new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: 'false'
    }))
  }

  return baseConfig
}
