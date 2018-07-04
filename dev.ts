import { existsSync } from 'fs-extra'
import { resolve } from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'

process.env.NODE_ENV = 'testing'

const defaultTemplate: string = 'with-javascript'
let templateName: string = defaultTemplate
if (3 <= process.argv.length) {
  const newTemplate: string = process.argv[2]
  if (!existsSync(resolve(__dirname, `examples/${newTemplate}`))) {
    console.log(chalk.red(`Not found examples/${newTemplate}`))
    console.log('')
    process.exit(1)
  }
  templateName = newTemplate
}

execSync('node ' + resolve(__dirname, `dist/cli/nextron.js init workspace --template ${templateName}`), {
  cwd: __dirname,
  stdio: 'inherit'
})
execSync('cd workspace')
execSync('yarn dev', {
  cwd: resolve(__dirname, 'workspace'),
  stdio: 'inherit'
})
