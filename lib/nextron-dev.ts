import { Command } from 'commander'
import { $ } from 'execa'
import webpack from 'webpack'
import { waitForPort } from 'get-port-please'
import * as logger from './logger'
import { getNextronConfig } from './helpers/get-nextron-config'
import { getMainConfig } from './webpack/development/get-main-config'
import { getPreloadConfig } from './webpack/development/get-preload-config'
import { terminateProcess } from './helpers/terminate-process'

const $$ = $({ cwd: process.cwd(), stdio: 'inherit' })

type DevCommandOptions = {
  rendererPort: number
  startupDelay: number
  electronOptions: string
  runOnly: boolean
}

export const devCommand = new Command('dev')

devCommand
  .option('--renderer-port <number>')
  .option('--startup-delay <number>')
  .option('--electron-options <string>')
  .option('--run-only')
  .action(async (options: DevCommandOptions) => {
    const rendererPort = options.rendererPort || 8888
    let electronOptions = options.electronOptions || ''
    if (!electronOptions.includes('--remote-debugging-port')) {
      electronOptions += ' --remote-debugging-port=5858'
    }
    if (!electronOptions.includes('--inspect')) {
      electronOptions += ' --inspect=9292'
    }
    electronOptions = electronOptions.trim()

    const nextronConfig = await getNextronConfig()
    const startupDelay = nextronConfig.startupDelay || options.startupDelay || 0

    let watchingMain: webpack.Watching | undefined
    let watchingPreload: webpack.Watching | undefined
    let mainProcess: ReturnType<typeof $$> | undefined
    let rendererProcess: ReturnType<typeof $$> | undefined // eslint-disable-line prefer-const
    const expectedExits = new WeakSet<ReturnType<typeof $$>>()
    let shuttingDown = false
    let shutdownTask: Promise<void> | undefined
    let restartTask = Promise.resolve()

    const stopProcess = async (child: ReturnType<typeof $$> | undefined) => {
      if (!child) {
        return
      }
      expectedExits.add(child)
      terminateProcess(child)
      await child.catch(() => {})
    }

    const shutdown = (exitCode: number) => {
      if (shutdownTask) {
        return shutdownTask
      }
      shuttingDown = true
      shutdownTask = (async () => {
        const closeWatchers = [watchingMain, watchingPreload].map(
          (watcher) =>
            new Promise<void>((resolve) => {
              if (watcher) {
                watcher.close(() => resolve())
              } else {
                resolve()
              }
            })
        )
        await stopProcess(mainProcess)
        await stopProcess(rendererProcess)
        await Promise.all(closeWatchers)
        process.exit(exitCode)
      })()
      return shutdownTask
    }

    const fail = (error: unknown) => {
      console.error(error)
      void shutdown(1).catch((shutdownError) => {
        console.error(shutdownError)
        process.exit(1)
      })
    }

    const startMainProcess = () => {
      if (shuttingDown) {
        return
      }
      logger.info(
        `Run main process: electron . ${rendererPort} ${electronOptions}`
      )
      const child = $$(
        'electron',
        ['.', `${rendererPort}`, ...electronOptions.split(' ')],
        { detached: process.platform !== 'win32', windowsHide: true }
      )
      mainProcess = child
      child.catch((error) => {
        if (!expectedExits.has(child) && !shuttingDown) {
          fail(error)
        }
      })
      child.unref()
    }

    const restartMainProcess = () => {
      restartTask = restartTask.then(async () => {
        if (shuttingDown) {
          return
        }
        await stopProcess(mainProcess)
        if (!shuttingDown) {
          startMainProcess()
        }
      })
      return restartTask
    }

    const startRendererProcess = () => {
      logger.info(
        `Run renderer process: next dev -p ${rendererPort} ${
          nextronConfig.rendererSrcDir || 'renderer'
        }`
      )
      const child = $$(
        'next',
        [
          'dev',
          '-p',
          String(rendererPort),
          nextronConfig.rendererSrcDir || 'renderer',
        ],
        { windowsHide: true }
      )
      child.then(
        () => {
          if (!shuttingDown) {
            void shutdown(0).catch(fail)
          }
        },
        (error) => {
          if (!expectedExits.has(child) && !shuttingDown) {
            fail(error)
          }
        }
      )
      return child
    }

    process.on('SIGINT', () => void shutdown(0).catch(fail))
    process.on('SIGTERM', () => void shutdown(0).catch(fail))
    process.on('exit', () => {
      // Exit listeners cannot await promises, but still release owned trees.
      for (const child of [mainProcess, rendererProcess]) {
        if (child) {
          expectedExits.add(child)
          try {
            terminateProcess(child)
          } catch (error) {
            console.error(error)
          }
        }
      }
    })

    rendererProcess = startRendererProcess()

    // wait until renderer process is ready
    await waitForPort(rendererPort, {
      delay: 500,
      retries: startupDelay / 500,
    }).catch(() => {
      logger.error(
        `Failed to start renderer process with port ${rendererPort} in ${startupDelay}ms`
      )
      return shutdown(1)
    })

    if (shuttingDown) {
      return
    }

    const mainConfig = await getMainConfig()
    const preloadConfig = await getPreloadConfig()

    if (shuttingDown) {
      return
    }

    // build preload script before starting main process
    await new Promise<void>((resolve) => {
      watchingPreload = webpack(preloadConfig).watch({}, (error) => {
        if (shuttingDown) {
          resolve()
          return
        }
        if (error) {
          fail(error)
          return
        }
        resolve()
      })
    })

    if (shuttingDown) {
      return
    }

    // wait until main process is ready
    await new Promise<void>((resolve) => {
      watchingMain = webpack(mainConfig).watch({}, (error) => {
        if (shuttingDown) {
          resolve()
          return
        }
        if (error) {
          fail(error)
          return
        }

        if (!options.runOnly) {
          void restartMainProcess().then(resolve, fail)
        } else {
          resolve()
        }
      })
    })

    if (options.runOnly) {
      startMainProcess()
    }
  })
