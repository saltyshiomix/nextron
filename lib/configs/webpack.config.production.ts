import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import { baseConfig } from './webpack.config.base'
import { getNextronConfig } from './getNextronConfig'

const { webpack: userWebpack } = getNextronConfig()

let config: webpack.Configuration = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),
    new webpack.DefinePlugin({
      'process.type': '"browser"',
    }),
  ],
  devtool: 'source-map',
})

if (typeof userWebpack === 'function') {
  config = userWebpack(config, 'development')
}

const compiler = webpack(config)

compiler.run((error, stats) => {
  if (error) {
    console.error(error.stack || error)
  }

  if (stats) {
    console.log(stats.toString())
  }
})
