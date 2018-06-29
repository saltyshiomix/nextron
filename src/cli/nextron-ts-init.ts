#!/usr/bin/env node

import { join } from 'path'
import * as program from 'commander'
import * as spinner from '../spinner'
import existsPath from './init/exists-path'
import copyTemplate from './init/copy-template'
import setAppName from './init/set-app-name'
import installDependencies from './init/install-dependencies'

let appName
const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .arguments('<name>')
  .action(function(name) {
    appName = name
  })

program.parse(process.argv)

if (typeof appName === 'undefined') {
  appName = 'my-nextron-typescript-app'
}

async function init(name: string): Promise<void> {
  const templatePath = join(__dirname, '../../template/typescript')
  const targetPath = join(process.cwd(), name)

  await existsPath(targetPath, name)
  await copyTemplate(templatePath, targetPath)
  await setAppName(targetPath, name)

  const pm = await installDependencies(targetPath)
  const cmd = pm === 'yarn' ? 'yarn dev' : 'npm run dev'
  spinner.clear(`Run \`${cmd}\` inside of "${name}" to start the app`)
}

init(appName)
