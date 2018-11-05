import { join } from 'path'
import { app } from 'electron'
import { createWindow, enableHotReload, resolveWithIpc } from './helpers'

const env = require('env')
const isProd = (env.name === 'production')

if (!isProd) {
  enableHotReload()

  const userDataPath = app.getPath('userData')
  app.setPath('userData', `${userDataPath} (${env.name})`)
}

// you can remove this if you don't use ipc
resolveWithIpc()

app.on('ready', () => {
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  })

  if (isProd) {
    const homeFile = join(app.getAppPath(), 'app/home/index.html')
    mainWindow.loadFile(homeFile)
  } else {
    const homeUrl = 'http://localhost:8888/home'
    mainWindow.loadURL(homeUrl)
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  app.quit()
})
