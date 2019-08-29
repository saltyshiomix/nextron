import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import electron from 'electron';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const onChange = (e) => setMessage(e.target.value);
  const onSubmit = (e) => {
    e.preventDefault();
    if (ipcRenderer) {
      ipcRenderer.send('add-message', message);
      setMessages([...messages, message]);
      setMessage(''); // clear the input value
    }
  };

  useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      setMessages(ipcRenderer.sendSync('get-messages'));
    }

    return () => {
      // componentWillUnmount()
    };
  }, []);

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
        <form onSubmit={onSubmit}>
          <input type="text" value={message} onChange={onChange} />
        </form>
        <ul>
          {messages.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default Home;
