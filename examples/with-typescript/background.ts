import { join } from 'path'
import { format } from 'url'
import { app } from 'electron'
import { createWindow } from 'nextron'
import env from 'env'

app.on('ready', () => {
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  });

  mainWindow.loadURL(
    format({
      pathname: join(__dirname, 'home/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  if (env.name === 'development') {
    mainWindow.openDevTools();
  }
});

app.on('window-all-closed', () => {
  app.quit()
})
