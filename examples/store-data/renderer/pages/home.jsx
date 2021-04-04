import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ipcRenderer = electron.ipcRenderer || false;

function Home() {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([]);

  const onChange = (e) => setMessage(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();

    ipcRenderer.send('add-message', message);
    setMessages([...messages, message]);
    setMessage('');
  };

  React.useEffect(() => {
    // like componentDidMount()
    setMessages(ipcRenderer.sendSync('get-messages'));

    return () => {
      // like componentWillUnmount()
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
        <img src="/images/logo.png" />
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
