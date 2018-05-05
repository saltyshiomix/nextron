const webpack = require('webpack')
const electron = require('electron')
const childProcess = require('child_process')

module.exports = function performStart(config) {
  const env = 'development'
  const compiler = webpack(config(env))
  let electronStarted = false

  const watching = compiler.watch({}, function(err, stats) {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true

      childProcess
        .spawn(electron, ['.'], { stdio: 'inherit' })
        .on('close', () => {
          watching.close()
        })
    }
  })
}
