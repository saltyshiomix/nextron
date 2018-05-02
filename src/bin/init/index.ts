import { join } from 'path'
import * as fs from 'fs-extra'
import { promisify } from 'util'
import { exec as defaultExec } from 'child_process'
import * as spinner from '../../spinner'

async function existsPath(targetPath: string, name: string): Promise<void> {
  if (!await fs.pathExists(targetPath)) {
    return
  }

  const overwrite = await spinner.prompt(`Directory "${name}" already exists. Overwrite?`)
  if (!overwrite) {
    spinner.clear('No action was taken')
    process.exit(0)
  }
}

async function copyTemplate(templatePath: string, targetPath: string): Promise<void> {
  spinner.create('Moving boilerplate into place')
  await fs.copy(templatePath, targetPath)
}

async function setAppName(targetPath: string, name: string): Promise<void> {
  spinner.create('Setting meta information')

  const path = join(targetPath, 'package.json')
  const content = await fs.readJSON(path)

  await fs.writeJSON(path, {
    ...content,
    name
  }, {
    spaces: 2
  })
}

async function installDependencies(cwd: string, cmd: string = 'yarn'): Promise<string> {
  if (cmd === 'yarn') {
    spinner.create('Installing dependencies')
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

export default async function init(name: string): Promise<void> {
  const templatePath = join(__dirname, '../../../template')
  const targetPath = join(process.cwd(), name)

  await existsPath(targetPath, name)
  await copyTemplate(templatePath, targetPath)
  await setAppName(targetPath, name)

  const pm = await installDependencies(targetPath)
  const cmd = pm === 'yarn' ? 'yarn dev' : 'npm run dev'
  spinner.clear(`Run \`${cmd}\` inside of "${name}" to start the app`)
}
