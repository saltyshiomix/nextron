const { app, BrowserWindow } = require('electron')
const { setWindow } = require('nextron')

app.on('ready', async () => {
  setWindow('index', new BrowserWindow({
    width: 800,
    height: 600
  }))
})

app.on('window-all-closed', app.quit)
