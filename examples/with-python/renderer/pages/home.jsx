import electron from 'electron';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// prevent SSR webpacking
const ipcRenderer = electron.ipcRenderer || false;

const Home = () => {
  const [result, setResult] = useState('no python result');

  const onClick = () => {
    if (ipcRenderer) {
      ipcRenderer.send('run-python');
    }
  };

  useEffect(() => {
    // componentDidMount()
    if (ipcRenderer) {
      ipcRenderer.on('result', (event, data) => {
        setResult(data);
      });
    }

    return () => {
      // componentWillUnmount()
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('result');
      }
    };
  }, []);

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
        <button onClick={onClick}>Run Python</button>
        <p>{result}</p>
      </div>
    </React.Fragment>
  );
};

export default Home;
