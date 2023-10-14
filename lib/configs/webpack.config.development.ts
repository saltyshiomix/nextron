import webpack from 'webpack'
import { merge } from 'webpack-merge'
import { getNextronConfig } from './getNextronConfig'
import { baseConfig } from './webpack.config.base'

const { webpack: userWebpack } = getNextronConfig()

let config: webpack.Configuration = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],
  devtool: 'inline-source-map',
})

if (typeof userWebpack === 'function') {
  config = userWebpack(config, 'development')
}

export { config }
