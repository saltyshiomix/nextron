import { promisify } from 'util'
import { exec as defaultExec } from 'child_process'

export default async function detectPackageManager(): Promise<'yarn'|'npm'|null> {
  let pm: 'yarn'|'npm'|null = 'yarn'

  const cwd: string = process.cwd()
  const exec = promisify(defaultExec)
  try {
    await exec(`${pm} -v`, { cwd })
  } catch (_) {
    pm = 'npm'

    try {
      await exec(`${pm} -v`, { cwd })
    } catch (_) {
      return null
    }
  }
  return pm
}
