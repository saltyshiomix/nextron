import { join } from 'path'
import * as fs from 'fs-extra'
import { promisify } from 'util'
import { exec as defaultExec } from 'child_process'
import detectPM from '../../lib/detect-pm'
import * as spinner from '../spinner'

export default async function installDependencies(cwd: string): Promise<'yarn'|'npm'> {
  const pm: 'yarn'|'npm'|null = await detectPM()
  if (pm === null) {
    spinner.fail('No available package manager! (`yarn` or `npm` is available)')
    process.exit(1)
  }

  spinner.create('Install dependencies')

  const exec = promisify(defaultExec)
  let stderr
  try {
    ({ stderr } = await exec(`${pm} install`, { cwd }))

    if (pm === 'npm') {
      await fs.remove(join(cwd, 'yarn.lock'))
    }
  } catch (err) {
    spinner.fail(`Not able to install dependencies: ${err}`)
    process.exit(1)
  }

  let check = stderr.includes('warning')
  if (pm === 'npm') {
    check = stderr.includes('npm WARN')
  }

  if (Boolean(stderr) && !check) {
    spinner.fail(`An error occurred: ${stderr}`)
  }

  return pm
}
