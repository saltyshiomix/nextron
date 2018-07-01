import { join } from 'path'
import * as fs from 'fs-extra'
import { promisify } from 'util'
import { exec as defaultExec } from 'child_process'
import * as spinner from '../spinner'

export default async function installDependencies(cwd: string, cmd: string = 'yarn'): Promise<string> {
  if (cmd === 'yarn') {
    spinner.create('Install dependencies')
  }

  const exec = promisify(defaultExec)
  let stderr

  try {
    ({ stderr } = await exec(cmd, { cwd }))

    if (cmd === 'npm install') {
      await fs.remove(join(cwd, 'yarn.lock'))
    }
  } catch (err) {
    if (cmd === 'yarn' && err.code === 127) {
      return module.exports(cwd, 'npm install')
    }

    spinner.fail('Not able to install dependencies')
    return
  }

  let check = stderr.includes('warning')

  if (cmd === 'npm install') {
    check = stderr.includes('npm WARN')
  }

  if (Boolean(stderr) && !check) {
    spinner.fail(`An error occurred: ${stderr}`)
  }

  return cmd
}
