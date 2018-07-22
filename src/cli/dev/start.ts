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

  let watching
  const rendererProc = startRendererProcess()

  const killWholeProcess = async () => {
    if (watching) {
      watching.close()
    }
    if (rendererProc) {
      rendererProc.kill()
    }
    await killPort(8888)
    process.exit(0)
  }
  process.on('SIGINT', killWholeProcess)
  process.on('SIGTERM', killWholeProcess)
  process.on('exit', killWholeProcess)

  await prepareRendererProcess()

  let electronStarted = false
  const compiler = webpack(config('development'))
  watching = compiler.watch({}, async (err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      execSync(`${detectBinPath('electron')} app${sep}background.js`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      })

      await killWholeProcess()
    }
  })
}
