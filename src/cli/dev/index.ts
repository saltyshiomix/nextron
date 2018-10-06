import { ChildProcess } from 'child_process'
import { npx, npxSync } from 'node-npx'
import * as delay from 'delay'
import * as webpack from 'webpack'
import * as config from '../../../build/webpack.main.config'

export default async function dev(): Promise<void> {
  const cwd: string = process.cwd()

  const startRendererProcess = (): ChildProcess => {
    const child: ChildProcess = npx('next', ['-p', '8888', 'renderer'], { cwd, stdio: 'inherit' })
    child.on('close', () => {
      process.exit(0)
    })
    return child
  }

  let watching
  let rendererProcess: ChildProcess
  const killWholeProcess = () => {
    if (watching) {
      watching.close()
    }
    if (rendererProcess) {
      rendererProcess.kill()
    }
  }

  process.on('SIGINT', killWholeProcess)
  process.on('SIGTERM', killWholeProcess)
  process.on('exit', killWholeProcess)

  rendererProcess = startRendererProcess()

  // TODO: wait for ready (renderer process)
  await delay(8000)

  let electronStarted = false
  const compiler = webpack(config('development'))
  watching = compiler.watch({}, async (err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true
      await npxSync('electron', ['.'], { cwd, stdio: 'inherit' })
    }
  })
}
