import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  setWindowIsReady: (isReady: boolean) => {
    ipcRenderer.send('window-is-ready', isReady)
  },
  onLauncherUrl: (callback) => {
    ipcRenderer.on('launcher-url', (_event, url: string) => {
      callback(url)
    })
  },
})
