import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'

import i18next from "../next-i18next.config.js"
import { userStore } from "./helpers/user-store"
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

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

  const locale = userStore.get("locale",  i18next.i18n.defaultLocale)
  console.log("Using locale:", locale)

  if (isProd) {
    await mainWindow.loadURL(`app://./${locale}/home`)
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/${locale}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
