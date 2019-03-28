import React from 'react';
import Head from 'next/head';
import electron from 'electron';
import { resolve } from '../helpers';

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
            ⚡ Electron + Next.js + Python ⚡ - <a href={resolve('next')}>Go to next page</a>
          </p>
          <img src={resolve('static/logo.png')} />
          <hr />
          <button onClick={this.handleClick}>Run Python</button>
          <p>{this.state.result}</p>
        </div>
      </React.Fragment>
    );
  }
};
