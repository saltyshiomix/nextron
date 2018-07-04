import { sep } from 'path'
import { execSync } from 'child_process'
import * as webpack from 'webpack'
import buildRenderer from '../../lib/next/build'
import config from '../../webpack/webpack.app.config'
import * as spinner from '../spinner'

export default async function start() {
  spinner.create('Building renderer process')
  await buildRenderer('renderer')

  spinner.create('Building main process')
  let electronStarted = false
  const compiler = webpack(config('development'))
  await compiler.run((err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      spinner.clear('Nextron app started!')
      execSync(`node_modules${sep}.bin${sep}electron app${sep}background.js`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      })
    }
  })
}
