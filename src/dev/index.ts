import { existsSync } from 'fs-extra'
import { resolve } from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'
import detectPM from '../lib/detect-pm'

async function dev(): Promise<void> {
  process.env.NODE_ENV = 'testing'

  const rootPath: string = resolve(__dirname, '../..')
  const defaultTemplate: string = 'with-javascript'
  let templateName: string = defaultTemplate
  if (3 <= process.argv.length) {
    const newTemplate: string = process.argv[2]
    if (!existsSync(resolve(rootPath, `examples/${newTemplate}`))) {
      console.log(chalk.red(`Not found examples/${newTemplate}`))
      console.log('')
      process.exit(1)
    }
    templateName = newTemplate
  }

  execSync('node ' + resolve(rootPath, `dist/cli/nextron.js init workspace --template ${templateName}`), {
    cwd: rootPath,
    stdio: 'inherit'
  })
  execSync('cd workspace')

  const pm: 'yarn'|'npm' = await detectPM()
  const cmd: string = pm === 'yarn' ? 'yarn dev' : 'npm run dev'
  execSync(cmd, {
    cwd: resolve(rootPath, 'workspace'),
    stdio: 'inherit'
  })
}

dev()
