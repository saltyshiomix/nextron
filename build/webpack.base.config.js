const { existsSync, readFileSync } = require('fs')
const { join, resolve } = require('path')
const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const cwd = process.cwd()
const externals = require(resolve(cwd, 'package.json')).dependencies
const possibleExternals = require(resolve(__dirname, '../../../package.json')).dependencies

function filterDepWithoutEntryPoints(dep) {
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

module.exports = (env, ext) => {
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

  return baseConfig
}
