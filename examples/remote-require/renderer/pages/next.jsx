import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Next = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (remote-require)</title>
      </Head>
      <p>
        ⚡ Electron + Next.js ⚡ -
        <Link href="/home">
          <a>Go to home page</a>
        </Link>
      </p>
    </React.Fragment>
  );
};

export default Next;
