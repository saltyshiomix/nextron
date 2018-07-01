import { join, sep } from 'path'
import { execSync } from 'child_process'
import * as fs from 'fs-extra'
import detectScriptType from '../detect-script-type'
import buildRenderer from '../../lib/next/build'
import * as spinner from '../spinner'

export default async function build() {
  const cwd = process.cwd()
  const scriptType: string = detectScriptType()

  try {
    spinner.create('Clearing previous builds')
    await fs.remove(join(cwd, 'app'))
    await fs.remove(join(cwd, 'dist'))

    spinner.create('Building renderer process')
    await buildRenderer('renderer')

    spinner.create('Building main process')
    execSync(`node_modules${sep}.bin${sep}webpack --config=node_modules${sep}nextron${sep}build${sep}${scriptType}${sep}webpack.app.config.js --env=production`, { cwd })

    spinner.create('Packaging - please wait a moment')
    console.log('')
    execSync(`node_modules${sep}.bin${sep}electron-builder`, {
      cwd, stdio: 'inherit'
    })

    spinner.clear('See `dist` directory')
  } catch (err) {
    spinner.fail('Cannot build electron packages. Please contact <shiono.yoshihide@gmail.com>.')
    console.log(err)
    process.exit(1)
  }
}
