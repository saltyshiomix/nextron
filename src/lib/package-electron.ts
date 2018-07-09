import { sep } from 'path'
import { execSync } from 'child_process'
import detectPM from './detect-pm'

export default async function packageElectron(args: string): Promise<void> {
  const pm: 'yarn'|'npm' = await detectPM()
  const cwd: string = process.cwd()
  let electronBuilder: string
  if (process.env.NODE_ENV === 'testing') {
    electronBuilder = pm === 'yarn' ? `node_modules${sep}.bin${sep}electron-builder` : `node_modules${sep}nextron${sep}node_modules${sep}.bin${sep}electron-builder`
  } else {
    electronBuilder = `node_modules${sep}.bin${sep}electron-builder`
  }
  await execSync(`${electronBuilder} ${args}`, {
    cwd,
    stdio: 'inherit'
  })
}
