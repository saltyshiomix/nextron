import { existsSync } from 'fs-extra'
import { resolve } from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'

process.env.NODE_ENV = 'testing'

const rootDir: string = resolve(__dirname, '..')
const defaultTemplate: string = 'with-javascript'
let templateName: string = defaultTemplate
if (3 <= process.argv.length) {
  const newTemplate: string = process.argv[2]
  if (!existsSync(resolve(rootDir, `examples/${newTemplate}`))) {
    console.log(chalk.red(`Not found examples/${newTemplate}`))
    console.log('')
    process.exit(1)
  }
  templateName = newTemplate
}

execSync(resolve(rootDir, `dist/cli/nextron.js init workspace --template ${templateName}`), {
  cwd: rootDir,
  stdio: 'inherit'
})
execSync('pushd workspace')
execSync('yarn dev', {
  cwd: resolve(rootDir, 'workspace'),
  stdio: 'inherit'
})
execSync('popd')
