import { sep } from 'path'
import { execSync } from 'child_process'
import detectPM from './detect-pm'

export default async function packageElectron(): Promise<void> {
  const pm: 'yarn'|'npm'|null = await detectPM()
  if (pm === null) {
    console.log('No available package manager! (`yarn` or `npm` is available)')
    process.exit(1)
  }

  const cwd: string = process.cwd()
  let electronBuilder: string
  if (process.env.NODE_ENV === 'testing') {
    electronBuilder = pm === 'yarn' ? `node_modules${sep}.bin${sep}electron-builder` : `node_modules${sep}nextron${sep}node_modules${sep}.bin${sep}electron-builder`
  } else {
    electronBuilder = `node_modules${sep}.bin${sep}electron-builder`
  }
  await execSync(electronBuilder, {
    cwd,
    stdio: 'inherit'
  })
}
