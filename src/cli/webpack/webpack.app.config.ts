import { resolve } from 'path'
import { smart as merge } from 'webpack-merge'
import baseConfig from './webpack.base.config'
import detectExt from '../../lib/util/detect-ext'

export default function config(env: string) {
  const ext: 'js'|'ts' = detectExt()

  return merge(baseConfig(env, ext), {
    entry: {
      background: `./background.${ext}`
    },
    output: {
      filename: resolve(process.cwd(), 'app/[name].js')
    }
  })
}
