import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import electron from 'electron';

export default class extends React.Component {
  // prevent SSR webpacking
  ipcRenderer = electron.ipcRenderer || false;

  state = {
    ipcResult: 'no ipc messaging',
  };

  onClickWithIpc = () => {
    if (this.ipcRenderer) {
      this.ipcRenderer.send('ping-pong', 'some data from ipcRenderer');
    }
  };

  onClickWithIpcSync = () => {
    if (this.ipcRenderer) {
      this.setState({
        ipcResult: this.ipcRenderer.sendSync('ping-pong-sync', 'some data from ipcRenderer'),
      });
    }
  };

  componentDidMount() {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('ping-pong', (event, data) => {
        this.setState({
          ipcResult: data,
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.ipcRenderer) {
      this.ipcRenderer.removeAllListeners('ping-pong');
    }
  }

  render() {
    return (
      <React.Fragment>
        <Head>
          <title>Home - Nextron (ipc-communication)</title>
        </Head>
        <div>
          <p>
            ⚡ Electron + Next.js ⚡ -
            <Link href="/next">
              <a>Go to next page</a>
            </Link>
          </p>
          <img src="/static/logo.png" />
          <hr />
          <button onClick={this.onClickWithIpc}>IPC messaging</button>
          <button onClick={this.onClickWithIpcSync}>IPC messaging (sync)</button>
          <p>{this.state.ipcResult}</p>
        </div>
      </React.Fragment>
    );
  }
}
