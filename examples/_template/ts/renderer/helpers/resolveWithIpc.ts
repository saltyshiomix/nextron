import electron from 'electron';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

export default function resolve(pathname) {
  if (ipcRenderer) {
    return ipcRenderer.sendSync('resolve', pathname);
  }
};
