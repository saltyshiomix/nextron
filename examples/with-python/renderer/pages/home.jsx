import React from 'react';
import Head from 'next/head';
import electron from 'electron';
import Link from 'next/link';

export default class extends React.Component {
  // prevent SSR webpacking
  ipcRenderer = electron.ipcRenderer || false;

  state = {
    result: 'no python result',
  };

  handleClick = () => {
    if (this.ipcRenderer) {
      this.ipcRenderer.send('run-python');
    }
  };

  componentDidMount() {
    if (this.ipcRenderer) {
      this.ipcRenderer.on('result', (event, data) => {
        console.log(data);
        this.setState({
          result: data,
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.ipcRenderer) {
      this.ipcRenderer.removeAllListeners('result');
    }
  }

  render() {
    return (
      <React.Fragment>
        <Head>
          <title>Home - Nextron (with-python)</title>
        </Head>

        <div>
          <p>
            ⚡ Electron + Next.js + Python ⚡ -
            <Link href="/next">
              <a>Go to next page</a>
            </Link>
          </p>
          <img src="/static/logo.png" />
          <hr />
          <button onClick={this.handleClick}>Run Python</button>
          <p>{this.state.result}</p>
        </div>
      </React.Fragment>
    );
  }
}
