const webpack = require('webpack')
const electron = require('electron')
const childProcess = require('child_process')
const config = require('./webpack.app.config')

const env = 'development'
const compiler = webpack(config(env))
let electronStarted = false

const watching = compiler.watch({}, (err, stats) => {
  if (!err && !stats.hasErrors() && !electronStarted) {
    electronStarted = true

    childProcess
      .spawn(electron, ['.'], { stdio: 'inherit' })
      .on('close', () => {
        watching.close()
      })
  }
})
