const webpack = require('webpack')
const electron = require('electron')
const childProcess = require('child_process')
const { buildRenderer } = require('nextron')

module.exports = async function performStart(config) {
  const compiler = webpack(config('development'))
  let electronStarted = false

  await buildRenderer('renderer')

  const watching = compiler.watch({}, function(err, stats) {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      childProcess
        .spawn(electron, ['./app/background.js'], { stdio: 'inherit' })
        .on('close', () => {
          watching.close()
        })
    }
  })
}
