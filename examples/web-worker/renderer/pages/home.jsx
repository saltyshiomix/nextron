import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import MyWorker from '../lib/my.worker';

const Home = () => {
  let worker;
  const [message, setMessage] = useState('');

  const onClick = () => {
    if (worker) {
      worker.postMessage('Hello');
    }
  };
  const onMessage = (event) => setMessage(event.data);

  useEffect(() => {
    // componentDidMount()
    worker = new MyWorker();
    worker.addEventListener('message', onMessage);

    return () => {
      // componentWillUnmount()
      worker.terminate();
    };
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (web-worker)</title>
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
        <button onClick={onClick}>Fire a worker!</button>
        <h1>Message from Worker: {message}</h1>
      </div>
    </React.Fragment>
  );
};

export default Home;
