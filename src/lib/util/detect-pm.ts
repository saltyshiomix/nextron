import { promisify } from 'util'
import { exec as defaultExec } from 'child_process'
import chalk from 'chalk'

export default async function detectPackageManager(): Promise<'yarn'|'npm'> {
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
      pm = null
    }
  }

  if (pm === null) {
    console.log(chalk.red('No available package manager! (`yarn` or `npm` is available)'))
    process.exit(1)
  }

  return pm
}
