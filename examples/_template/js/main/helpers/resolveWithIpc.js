import { join } from 'path';
import { app, ipcMain, BrowserWindow } from 'electron';

export default function resolveWithIpc() {
  const isProd = process.env.NODE_ENV === 'production';

  ipcMain.on('resolve', (event, pathname) => {
    let resolved;
    if (isProd) {
      const isAssets = /\.(png|jpe?g|gif|svg|js|css)(\?.*)?$/.test(pathname);
      resolved = join(app.getAppPath(), isAssets ? `app/${pathname}` : `app/${pathname}/index.html`);
    } else {
      resolved = `http://localhost:8888/${pathname}`;
    }
    event.returnValue = resolved;
  });

  ipcMain.on('load', (event, resolved) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!(win && win.isDestroyed())) {
      if (isProd) {
        win.loadFile(resolved);
      } else {
        win.loadURL(resolved);
      }
    }
  });
};
