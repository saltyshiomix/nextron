import { spawn } from 'cross-spawn'
import detectBinPath from '../../lib/util/detect-bin-path'

export default function startRendererProcess() {
  const proc = spawn(detectBinPath('next'), ['-p', '8888', 'renderer'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
  proc.on('close', (code, signal) => {
    if (code !== null) {
      process.exit(code)
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        process.exit(137)
      }
      process.exit(1)
    }
    process.exit(0)
  })
  proc.on('error', (err) => {
    console.log(err)
    process.exit(1)
  })
  return proc
}
