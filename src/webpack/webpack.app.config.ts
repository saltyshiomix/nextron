import { resolve } from 'path'
import * as merge from 'webpack-merge'
import baseConfig from './webpack.base.config'
import detectExtension from './detect-extension'

export default function config(env: string) {
  const ext: 'js'|'ts' = detectExtension()

  return merge(baseConfig(env, ext), {
    entry: {
      background: `./background.${ext}`
    },
    output: {
      filename: '[name].js',
      path: resolve(process.cwd(), 'app')
    }
  })
}
