import { sep } from 'path'
import { execSync } from 'child_process'
import * as webpack from 'webpack'
import buildRendererProcess from '../../lib/build-renderer-process'
import config from '../../webpack/webpack.app.config'
import detectPM from '../../lib/detect-pm'
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

      const pm: 'yarn'|'npm' = await detectPM()
      let electron: string
      if (process.env.NODE_ENV === 'testing') {
        electron = pm === 'yarn' ? `node_modules${sep}.bin${sep}electron` : `node_modules${sep}nextron${sep}node_modules${sep}.bin${sep}electron`
      } else {
        electron = `node_modules${sep}.bin${sep}electron`
      }

      spinner.clear('Nextron app started!')
      execSync(`${electron} app${sep}background.js`, {
        cwd: process.cwd(),
        stdio: 'inherit'
      })
    }
  })
}
