const { existsSync } = require('fs')
const { resolve } = require('path')
const { smart: merge } = require('webpack-merge')
const base = require('./webpack.base.config')

function detectExtension() {
  return existsSync(resolve(process.cwd(), 'tsconfig.json')) ? 'ts' : 'js'
}

module.exports = (env) => {
  const ext = detectExtension()

  return merge(base(env, ext), {
    entry: {
      background: `./background.${ext}`
    },
    output: {
      filename: '[name].js',
      path: resolve(process.cwd(), 'app')
    }
  })
}
