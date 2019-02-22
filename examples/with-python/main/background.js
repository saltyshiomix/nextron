import { join } from 'path'
import { app, ipcMain } from 'electron'
import { createWindow, exitOnChange } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (!isProd) {
  exitOnChange()

  const userDataPath = app.getPath('userData')
  app.setPath('userData', `${userDataPath} (development)`)
}

ipcMain.on('run-python', (event, arg) => {
  const spawn = require('cross-spawn')
  let result
  if (process.env.NODE_ENV === 'production') {
    const executable = join(__dirname, process.platform === 'win32' ? 'hello.exe' : 'hello')
    result = spawn.sync(executable, [], { encoding: 'utf8' })
  } else {
    result = spawn.sync('python', [join(__dirname, '../python/hello.py')], { encoding: 'utf8' })
  }
  event.sender.send('result', result.stdout)
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
