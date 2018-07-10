import { sep } from 'path'
import { execSync } from 'child_process'
import * as webpack from 'webpack'
import buildRendererProcess from '../build/build-renderer-process'
import config from '../webpack/webpack.app.config'
import detectBinPath from '../../lib/util/detect-bin-path'
import * as spinner from '../spinner'

export default async function start() {
  spinner.create('Building renderer process')
  await buildRendererProcess('renderer')

  spinner.create('Building main process')
  let electronStarted = false
  const compiler = webpack(config('development'))
  await compiler.run(async (err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      spinner.clear('Nextron app started!')
      execSync(`${detectBinPath('electron')} app${sep}background.js`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      })
    }
  })
}
