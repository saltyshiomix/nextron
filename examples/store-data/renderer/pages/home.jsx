import React from 'react';
import electron from 'electron';
import { resolve } from '../helpers';

export default class extends React.Component {
  // prevent SSR webpacking
  ipcRenderer = electron.ipcRenderer || false;

  state = {
    message: '',
    messages: [],
  };

  handleChange = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.ipcRenderer) {
      this.ipcRenderer.send('add-message', this.state.message);
      this.setState({
        message: '',
        messages: [...this.state.messages, this.state.message],
      });
    }
  };

  componentDidMount() {
    if (this.ipcRenderer) {
      const messages = this.ipcRenderer.sendSync('get-messages');
      this.setState({ messages });
    }
  }

  render() {
    const messages = [];
    for (let i = 0; i < this.state.messages.length; i++) {
      const message = this.state.messages[i];
      messages.push(<li key={i}>{message}</li>);
    }

    return (
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <a href={resolve('next')}>To Next Page</a>
        </p>
        <img src={resolve('static/logo.png')} />
        <hr />
        <h2>Enter your message:</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.message} onChange={this.handleChange} />
        </form>
        <ul>
          {messages}
        </ul>
      </div>
    );
  }
};
