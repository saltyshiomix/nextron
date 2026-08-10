import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin'
import { isTs, ext, externals } from '../helpers/get-project-settings'
import { getNextronConfig } from '../helpers/get-nextron-config'

const cwd = process.cwd()

export const getBaseConfigPreload =
  async (): Promise<webpack.Configuration> => {
    const { mainSrcDir } = await getNextronConfig()

    const preloadPath = path.join(cwd, mainSrcDir || 'main', `preload${ext}`)
    if (!fs.existsSync(preloadPath)) {
      return {}
    }

    const config: webpack.Configuration = {
      target: 'electron-preload',
      entry: {
        preload: preloadPath,
      },
      output: {
        filename: '[name].js',
        path: path.join(cwd, 'app'),
        library: {
          type: 'umd',
        },
      },
      externals: [...Object.keys(externals || {})],
      module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            include: path.join(cwd, mainSrcDir || 'main'),
            use: {
              loader: 'ts-loader',
              options: {
                logLevel: 'error',
                transpileOnly: true,
                compiler: 'typescript6',
                compilerOptions: {
                  noEmit: false,
                },
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: ['node_modules', path.join(cwd, 'app')],
        plugins: [isTs ? new TsconfigPathsPlugins() : null].filter(Boolean),
        symlinks: false, // support pnpm
      },
      stats: 'errors-only',
      node: {
        __dirname: false,
        __filename: false,
      },
    }

    return config
  }
