import fs from 'fs'
import path from 'path'
import { merge } from 'webpack-merge'
import { configureWebpack } from './configureWebpack'
import { getNextronConfig } from '../getNextronConfig'

const cwd = process.cwd()
const ext = fs.existsSync(path.join(cwd, 'tsconfig.json')) ? '.ts' : '.js'

export const getWebpackConfig = (env: 'development' | 'production') => {
  const { mainSrcDir, webpack } = getNextronConfig()
  const userConfig = merge(configureWebpack(env), {
    entry: {
      background: path.join(cwd, mainSrcDir || 'main', `background${ext}`),
    },
    output: {
      filename: '[name].js',
      path: path.join(cwd, 'app'),
    },
  })

  const userWebpack = webpack || {}
  if (typeof userWebpack === 'function') {
    return userWebpack(userConfig, env)
  } else {
    return merge(userConfig, userWebpack)
  }
}
