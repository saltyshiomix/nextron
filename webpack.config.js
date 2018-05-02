const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPlugin = require('webpack-shell-plugin')

const baseConfig = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  }
}

module.exports = [
  merge(baseConfig, {
    entry: {
      nextron: './src/bin/nextron.ts',
      'nextron-init': './src/bin/nextron-init.ts',
      'nextron-dev': './src/bin/nextron-dev.ts',
      'nextron-build': './src/bin/nextron-build.ts'
    },
    output: {
      filename: 'dist/bin/[name].js',
      path: __dirname
    },
    plugins: [
      new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
      new WebpackShellPlugin({
        onBuildEnd:[
          'chmod +x dist/bin/nextron.js',
          'chmod +x dist/bin/nextron-init.js',
          'chmod +x dist/bin/nextron-dev.js',
          'chmod +x dist/bin/nextron-build.js'
        ]
      })
    ]
  }),
  merge(baseConfig, {
    entry: {
      main: './src/main.ts'
    },
    output: {
      filename: 'dist/[name].js',
      path: __dirname
    }
  })
]
