import electron from 'electron';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [message, setMessage] = useState('no ipc message');

  const onClickWithIpc = () => {
    if (ipcRenderer) {
      ipcRenderer.send('ping-pong', 'some data from ipcRenderer');
    }
  };

  const onClickWithIpcSync = () => {
    if (ipcRenderer) {
      setMessage(ipcRenderer.sendSync('ping-pong-sync', 'some data from ipcRenderer'));
    }
  };

  useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      // register `ping-pong` event
      ipcRenderer.on('ping-pong', (event, data) => {
        setMessage(data);
      });
    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        // unregister it
        ipcRenderer.removeAllListeners('ping-pong');
      }
    };
  }, []);

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
        <img src="/images/logo.png" />
        <hr />
        <button onClick={onClickWithIpc}>IPC messaging</button>
        <button onClick={onClickWithIpcSync}>IPC messaging (sync)</button>
        <p>{message}</p>
      </div>
    </React.Fragment>
  );
};

export default Home;
