import { spawn } from 'cross-spawn'
import detectBinPath from '../../lib/util/detect-bin-path'

export default function startRendererProcess() {
  const proc = spawn(detectBinPath('next'), ['-p', '8888', 'renderer'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
  return proc
}
