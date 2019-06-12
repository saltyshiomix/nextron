import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import * as Store from 'electron-store';

import { createWindow, exitOnChange } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();

  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (development)`);
}

const store = new Store({ name: 'messages' });

ipcMain.on('get-messages', (event, arg) => {
  event.returnValue = store.get('messages') || [];
});

ipcMain.on('add-message', (event, arg) => {
  const messages = store.get('messages') || [];
  messages.push(arg);
  store.set('messages', messages);
});

(async () => {
  // Can't use app.on('ready',...)
  // https://github.com/sindresorhus/electron-serve/issues/15
  await app.whenReady();
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    mainWindow.loadURL('app://./home');
  } else {
    const homeUrl = 'http://localhost:8888/home';
    mainWindow.loadURL(homeUrl);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});
