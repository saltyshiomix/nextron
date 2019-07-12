import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow, exitOnChange } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();

  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (development)`);
}

(async () => {
  // Can't use app.on('ready',...)
  // https://github.com/sindresorhus/electron-serve/issues/15
  await app.whenReady();
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const homeUrl = 'http://localhost:8888/home';
    await mainWindow.loadURL(homeUrl);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
