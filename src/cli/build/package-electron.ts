import { execSync } from 'child_process'
import detectBinPath from '../../lib/util/detect-bin-path'

export default async function packageElectron(args: string): Promise<void> {
  await execSync(`${detectBinPath('electron-builder')} ${args}`, {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
}
