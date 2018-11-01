const { join } = require('path')
const { app } = require('electron')
const { watchFile } = require('fs')

module.exports = function enableHotReload() {
  watchFile(join(process.cwd(), 'app/background.js'), () => {
    app.relaunch()
    app.exit(0)
  })
}
