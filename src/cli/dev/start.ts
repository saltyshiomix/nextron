import { sep } from 'path'
import { execSync } from 'child_process'
import * as fkill from 'fkill'
import * as webpack from 'webpack'
import config from '../webpack/webpack.app.config'
import detectBinPath from '../../lib/util/detect-bin-path'
import startRendererProcess from './start-renderer-process'
import prepareRendererProcess from './prepare-renderer-process'

export default async function start() {
  const rendererProc = startRendererProcess()

  const killRendererProcess = () => {
    if (rendererProc) {
      rendererProc.kill()
    }
    try {
      fkill(':8888')
    } catch (_) {}
  }
  process.on('SIGINT', killRendererProcess)
  process.on('SIGTERM', killRendererProcess)
  process.on('exit', killRendererProcess)

  await prepareRendererProcess()

  let electronStarted = false
  const compiler = webpack(config('development'))
  const watching = compiler.watch({}, (err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      execSync(`${detectBinPath('electron')} app${sep}background.js`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      })

      killRendererProcess()
      watching.close()
      process.exit(0)
    }
  })
}
