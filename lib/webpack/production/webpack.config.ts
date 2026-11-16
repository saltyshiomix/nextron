import webpack from 'webpack'
import { merge } from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import { getBaseConfigMain } from '../get-base-config-main'
import { getBaseConfigPreload } from '../get-base-config-preload'
import { getNextronConfig } from '../../helpers/get-nextron-config'

const runWebpack = (config: webpack.Configuration): Promise<void> =>
  new Promise((resolve, reject) => {
    webpack(config).run((error, stats) => {
      if (error) {
        reject(error)
        return
      }

      if (stats?.hasErrors()) {
        reject(new Error(stats.toString({ colors: false })))
        return
      }

      resolve()
    })
  })

const buildMainScript = async (): Promise<void> => {
  let config: webpack.Configuration = merge(await getBaseConfigMain(), {
    mode: 'production',
    devtool: 'source-map',
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
      }),
    ],
  })

  const { webpack: userWebpack } = await getNextronConfig()
  if (typeof userWebpack === 'function') {
    config = userWebpack(config, 'production')
  }

  await runWebpack(config)
}

const buildPreloadScript = async (): Promise<void> => {
  const config: webpack.Configuration = merge(await getBaseConfigPreload(), {
    mode: 'production',
    devtool: 'source-map',
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
      }),
    ],
  })

  await runWebpack(config)
}

;(async () => {
  await Promise.all([buildMainScript(), buildPreloadScript()])
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
