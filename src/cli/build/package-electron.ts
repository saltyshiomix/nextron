import { spawn } from 'cross-spawn'
import detectBinPath from '../../lib/util/detect-bin-path'

export default async function packageElectron(args: string[]): Promise<void> {
  await spawn.sync(detectBinPath('electron-builder'), [...args], {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
}
