import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import '../styles/home.less';

export default () => (
  <React.Fragment>
    <Head>
      <title>Home - Nextron (with-typescript-less)</title>
    </Head>
    <div className="home">
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
