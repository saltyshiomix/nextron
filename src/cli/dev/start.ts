import { sep } from 'path'
import { execSync } from 'child_process'
import * as webpack from 'webpack'
import config from '../webpack/webpack.app.config'
import detectBinPath from '../../lib/util/detect-bin-path'
import startRendererProcess from './start-renderer-process'
import prepareRendererProcess from './prepare-renderer-process'

export default async function start() {
  const rendererProc = startRendererProcess()

  const wrapper = () => {
    if (rendererProc) {
      rendererProc.kill()
    }
  }
  process.on('SIGINT', wrapper)
  process.on('SIGTERM', wrapper)
  process.on('exit', wrapper)

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

      if (rendererProc) {
        rendererProc.kill()
      }
    }
  })
}
