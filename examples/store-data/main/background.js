import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import * as Store from 'electron-store';
import {
  createWindow,
  exitOnChange,
} from './helpers';

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

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[3];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

const store = new Store({ name: 'messages' });

ipcMain.on('get-messages', (event, arg) => {
  event.returnValue = store.get('messages') || [];
});

ipcMain.on('add-message', (event, arg) => {
  const messages = store.get('messages') || [];
  messages.push(arg);
  store.set('messages', messages);
});
