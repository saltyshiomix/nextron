import React from 'react';
import Head from 'next/head';
import electron from 'electron';
import Link from 'next/link';

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
      <React.Fragment>
        <Head>
          <title>Home - Nextron (store-data)</title>
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
          <h2>Enter your message:</h2>
          <form onSubmit={this.handleSubmit}>
            <input type="text" value={this.state.message} onChange={this.handleChange} />
          </form>
          <ul>{messages}</ul>
        </div>
      </React.Fragment>
    );
  }
}
