import path from 'path'
import webpack from 'webpack'
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin'
import { isTs, ext, isEsm, externals } from '../helpers/get-project-settings'
import { getNextronConfig } from '../helpers/get-nextron-config'

const cwd = process.cwd()

export const getBaseConfigMain = async (): Promise<webpack.Configuration> => {
  const { mainSrcDir } = await getNextronConfig()

  const mainPath = path.join(cwd, mainSrcDir || 'main', `main${ext}`)

  const config: webpack.Configuration = {
    target: 'electron-main',
    entry: {
      main: mainPath,
    },
    output: {
      filename: '[name].js',
      path: path.join(cwd, 'app'),
      module: isEsm,
      library: {
        type: isEsm ? 'module' : 'umd',
      },
    },
    experiments: {
      outputModule: isEsm,
    },
    externals: [...Object.keys(externals || {})],
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: [/node_modules/, path.join(cwd, 'renderer')],
          use: {
            loader: 'ts-loader',
            options: {
              logLevel: 'error',
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
      modules: ['node_modules'],
      plugins: [isTs ? new TsconfigPathsPlugins() : null].filter(Boolean),
    },
    stats: 'errors-only',
    node: {
      __dirname: false,
      __filename: false,
    },
  }

  return config
}
