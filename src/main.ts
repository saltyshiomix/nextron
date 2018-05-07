import * as electronIsDev from 'electron-is-dev'
import * as prepareNext from 'electron-next'

export const isDev: boolean = electronIsDev

export async function prepareNextRenderer(rendererRelativePath: string): Promise<any> {
  return await prepareNext(rendererRelativePath)
}

export function resolve(pathname: string): string {
  if (process.env.NODE_ENV !== 'production') {
    return '/' + pathname
  }

  const { sep } = require('path')
  return `..${sep}${pathname}${sep}index.html`
}

export function withTypeScript(nextConfig: any = {}) {
  if (!nextConfig.pageExtensions) {
    nextConfig.pageExtensions = ['jsx', 'js']
  }

  if (nextConfig.pageExtensions.indexOf('ts') === -1) {
    nextConfig.pageExtensions.unshift('ts')
  }

  if (nextConfig.pageExtensions.indexOf('tsx') === -1) {
    nextConfig.pageExtensions.unshift('tsx')
  }

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const path = require('path')
      const { dir, defaultLoaders, dev, isServer } = options

      config.resolve.extensions.push('.ts', '.tsx')

      if (dev && !isServer) {
        config.module.rules.push({
          test: /\.(ts|tsx)$/,
          loader: 'hot-self-accept-loader',
          include: [path.join(dir, 'pages')],
          options: {
            extensions: /\.(ts|tsx)$/
          }
        })
      }

      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: [dir],
        exclude: /node_modules/,
        use: [
          defaultLoaders.babel,
          {
            loader: 'ts-loader',
            options: Object.assign(
              {},
              {
                transpileOnly: true
              },
              nextConfig.typescriptLoaderOptions
            )
          }
        ]
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    }
  })
}
