import { join } from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
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
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('run-python', (event, arg) => {
  const spawn = require('cross-spawn');
  let result;
  if (process.env.NODE_ENV === 'production') {
    const executable = join(__dirname, process.platform === 'win32' ? 'hello.exe' : 'hello');
    result = spawn.sync(executable, [], { encoding: 'utf8' });
  } else {
    result = spawn.sync('python', [join(__dirname, '../python/hello.py')], { encoding: 'utf8' });
  }
  event.sender.send('result', result.stdout);
});
