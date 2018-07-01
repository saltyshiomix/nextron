#!/usr/bin/env node

import { existsSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'
import * as parseArgs from 'minimist'
import * as spinner from './spinner'
import copyTemplate from './init/copy-template'
import setMetaInformation from './init/set-meta-information'
import installDependencies from './init/install-dependencies'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    t: 'template'
  },
  boolean: ['h'],
  string: ['t'],
  default: {
    t: 'with-javascript'
  }
})

if (argv.help) {
  console.log(`
    Description
      Create the nextron application

    Usage
      $ nextron init <name> -t <template name>

    <name> represents your application name (default to 'my-nextron-app').
    <template name> is listed on examples/* folder.

    Options
      --template, -t  Which example to use as default template
      --help, -h      Displays this message
  `)
  process.exit(0)
}

const rootDir: string = resolve(__dirname, '../..')
const appName: string = argv._[0] || 'my-nextron-app'
const templateName: string = argv.template

if (!existsSync(resolve(rootDir, `examples/${templateName}`))) {
  console.log(chalk.red(`Not found examples/${templateName}`))
  process.exit(1)
}

async function init(name: string): Promise<void> {
  const cwd = process.cwd()
  const templatePath = resolve(__dirname, `../../examples/${templateName}`)
  const targetPath = resolve(cwd, name)

  await copyTemplate(templatePath, targetPath)
  await setMetaInformation(targetPath, name)

  const pm = await installDependencies(targetPath)
  const cmd = pm === 'yarn' ? 'yarn dev' : 'npm run dev'
  spinner.clear(`Run \`${cmd}\` inside of "${name}" to start the app`)
}

init(appName)
