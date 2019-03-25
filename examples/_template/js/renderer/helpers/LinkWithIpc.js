import electron from 'electron';
import Link from 'next/link';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

export default class extends Link {
  linkClicked = e => {
    e.preventDefault();

    if (ipcRenderer) {
      const resolved = ipcRenderer.sendSync('resolve', this.props.href);
      ipcRenderer.send('load', resolved);
    }
  };
};
