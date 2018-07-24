import npx from 'node-npx'
import * as webpack from 'webpack'
import config from '../webpack/webpack.app.config'
import startRendererProcess from './start-renderer-process'
import killPort from './kill-port'

export default async function start() {
  await killPort(8888)

  let watching
  const rendererProc = await startRendererProcess()
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

  let electronStarted = false
  const compiler = webpack(config('development'))
  watching = compiler.watch({}, async (err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      await npx('electron', ['.'], {
        cwd: process.cwd(),
        stdio: 'inherit'
      })

      await killWholeProcess()
    }
  })
}
