import * as delay from 'delay'
import { npxAsync as npx } from 'node-npx'

export default async function startRendererProcess(): Promise<any> {
  const proc = npx('next', ['-p', '8888', 'renderer'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  })

  // TODO: wait for ready (renderer process)
  await delay(10000)

  return proc
}
