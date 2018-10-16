import { join } from 'path'
import { format } from 'url'
import { app } from 'electron'
import { createWindow, enableHotReload } from './helpers'

const env = require('env')
const isProd = (env.name === 'production')

if (!isProd) {
  enableHotReload()

  const userDataPath = app.getPath('userData')
  app.setPath('userData', `${userDataPath} (${env.name})`)
}

app.on('ready', () => {
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  })

  const homeUrl = isProd ? format({
    pathname: join(__dirname, 'home/index.html'),
    protocol: 'file:',
    slashes: true
  }) : 'http://localhost:8888/home'

  mainWindow.loadURL(homeUrl)

  if (!isProd) {
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  app.quit()
})
