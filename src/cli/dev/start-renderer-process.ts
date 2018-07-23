import { spawn } from 'cross-spawn'
import * as delay from 'delay'
import detectBinPath from '../../lib/util/detect-bin-path'

export default async function startRendererProcess(): Promise<any> {
  const proc = spawn(detectBinPath('next'), ['-p', '8888', 'renderer'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  })

  // TODO: wait for ready (renderer process)
  await delay(10000)

  return proc
}
