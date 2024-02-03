import path from 'path'
import { exec } from 'child_process'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

async function startProcess(event, value) {
  if (event) {
    /*
      'parentDir' is used to get this folder -> /Applications/<youApp>.app/Contents/ 
      so that we can run our .sh file which will also launch the Python or Rust script.
      So the script folder will be moved into parentDir/ in prod mode.
      Note: this will only work if the target mahcine have Python or Rust installed.
    */
    let scriptPath
    if (isProd) {
      const parentDir = path.dirname(path.dirname(path.dirname(__dirname)))
      scriptPath = path.join(parentDir, 'scripts/runner.sh')
    } else {
      scriptPath = path.join(__dirname, '../scripts/runner.sh')
    }
    // console.log(`DEBUG: scriptPath: ${scriptPath}`)
    const cmd = `sh "${scriptPath}" ${value}`

    exec(cmd, (error, stdout) => {
      if (error) {
        console.error(`ERROR: Error executing post-install script: ${error}`) // will be seen only dev mode, not in prod mode
        event.sender.send('log', error.message) // will be seen in both dev and prod mode (in the frontend)
        return
      }
      event.sender.send('log', 'Python script executed successfully')
      event.sender.send('message', stdout)
    })

    // ~/.yourApp.log will be helpfull to log process in production mode
  }
}

ipcMain.on('run-sh', async (event, value) => {
  console.log('DEBUG: starting process') // for dev mode
  event.sender.send('log', 'Running...') // for prod mode
  await startProcess(event, value)
})

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})
