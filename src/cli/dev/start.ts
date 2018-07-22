import { sep } from 'path'
import { execSync } from 'child_process'
import * as webpack from 'webpack'
import config from '../webpack/webpack.app.config'
import detectBinPath from '../../lib/util/detect-bin-path'
import startRendererProcess from './start-renderer-process'
import prepareRendererProcess from './prepare-renderer-process'
import killPort from './kill-port'

export default async function start() {
  await killPort(8888)

  const rendererProc = startRendererProcess()

  const killRendererProcess = async () => {
    if (rendererProc) {
      rendererProc.kill()
    }
    await killPort(8888)
  }
  process.on('SIGINT', killRendererProcess)
  process.on('SIGTERM', killRendererProcess)
  process.on('exit', killRendererProcess)

  await prepareRendererProcess()

  let electronStarted = false
  const compiler = webpack(config('development'))
  const watching = compiler.watch({}, async (err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      execSync(`${detectBinPath('electron')} app${sep}background.js`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      })

      await killRendererProcess()
      watching.close()
      process.exit(0)
    }
  })
}
