import { join } from 'path'
import { app, ipcMain } from 'electron'
import { createWindow, exitOnChange, resolveWithIpc } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (!isProd) {
  exitOnChange()

  const userDataPath = app.getPath('userData')
  app.setPath('userData', `${userDataPath} (development)`)
}

resolveWithIpc()

ipcMain.on('ping-pong', (event, arg) => {
  event.sender.send('ping-pong', `[ipcMain] "${arg}" received asynchronously.`)
})

ipcMain.on('ping-pong-sync', (event, arg) => {
  event.returnValue = `[ipcMain] "${arg}" received synchronously.`
})

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
