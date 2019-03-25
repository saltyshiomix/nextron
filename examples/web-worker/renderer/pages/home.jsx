import React from 'react';
import { resolve } from '../helpers';
import MyWorker from '../lib/my.worker';

export default class extends React.Component {
  state = {
    latestMessage: null,
  };

  handleClick = (e) => {
    e.preventDefault();
    this.worker.postMessage('Hello');
  };

  onWorkerMessage = (event) => {
    this.setState({ latestMessage: event.data });
  };

  componentDidMount() {
    this.worker = new MyWorker();
    this.worker.addEventListener('message', this.onWorkerMessage);
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  render() {
    return (
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <a href={resolve('next')}>To Next Page</a>
        </p>
        <img src={resolve('static/logo.png')} />
        <hr />
        <button onClick={this.handleClick}>Fire a worker!</button>
        <h1>Message from Worker: {this.state.latestMessage}</h1>
      </div>
    );
  }
}
