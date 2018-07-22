import { execSync } from 'child_process'
import { sleep } from 'sleep'
import * as detect from 'detect-port'
import detectBinPath from '../../lib/util/detect-bin-path'

export default async function killPort(portNumber: number): Promise<void> {
  sleep(1)
  const port: number = await detect(portNumber)
  if (portNumber !== port) {
    execSync(`${detectBinPath('fkill')} -f :${portNumber}`)
  }
}
