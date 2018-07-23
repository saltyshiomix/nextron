import { spawn } from 'cross-spawn'
import * as delay from 'delay'
import * as detect from 'detect-port'
import detectBinPath from '../../lib/util/detect-bin-path'

export default async function killPort(portNumber: number): Promise<void> {
  await delay(1000)
  const port: number = await detect(portNumber)
  if (portNumber !== port) {
    spawn.sync(detectBinPath('fkill'), ['-f', `:${portNumber}`])
  }
}
