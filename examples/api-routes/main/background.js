import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow, exitOnChange } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  const homeUrl = isProd ? 'app://./home.html' : 'http://localhost:8888/home';
  await mainWindow.loadURL(homeUrl);

  if (!isProd) {
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('get-base-url', (event) => {
  event.returnValue = isProd ? 'app://./' : 'http://localhost:8888';
});
