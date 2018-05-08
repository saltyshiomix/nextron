import * as path from 'path'
import { format } from 'url'
import { app, BrowserWindow } from 'electron'
import * as isDev from 'electron-is-dev'
import * as prepareNext from 'electron-next'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow

async function createMainWindow(): Promise<BrowserWindow> {
  isDev && await prepareNext('./renderer')

  const window: BrowserWindow = new BrowserWindow()
  isDev && window.webContents.openDevTools()

  const url: string = isDev ? 'http://localhost:8000/home' : format({
    pathname: path.join(__dirname, '../renderer/home/index.html'),
    protocol: 'file',
    slashes: true
  })

  window.loadURL(url)

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (mainWindow === null) {
    mainWindow = await createMainWindow()
  }
})

app.on('ready', async () => {
  mainWindow = await createMainWindow()
})
