import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default () => (
  <React.Fragment>
    <Head>
      <title>Home - Nextron (custom-server-typescript)</title>
    </Head>
    <div>
      <p>
        ⚡ Electron + Next.js ⚡ -
        <Link href="/next">
          <a>Go to next page</a>
        </Link>
      </p>
      <img src="/static/logo.png" />
    </div>
  </React.Fragment>
);
