import * as delay from 'delay'
import * as detect from 'detect-port'
import npx from 'node-npx'

export default async function killPort(portNumber: number): Promise<void> {
  await delay(1000)
  const port: number = await detect(portNumber)
  if (portNumber !== port) {
  	npx('fkill', ['-f', `:${portNumber}`])
  }
}
