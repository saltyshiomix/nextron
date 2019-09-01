import electron from 'electron';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// prevent SSR webpacking
const remote = electron.remote || false;

const Home = () => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    // componentDidMount()
    if (remote) {
      setConfig(remote.require('./config').default);
    }

    return () => {
      // componentWillUnmount()
    };
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (remote-require)</title>
      </Head>
      <p>
        ⚡ Electron + Next.js ⚡ -
        <Link href="/next">
          <a>Go to next page</a>
        </Link>
      </p>
      <hr/>
      <p>{config.message}</p>
    </React.Fragment>
  );
};

export default Home;
