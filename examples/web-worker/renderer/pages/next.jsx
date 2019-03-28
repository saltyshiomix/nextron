import React from 'react';
import Head from 'next/head';
import { resolve } from '../helpers';

export default () => (
  <React.Fragment>
    <Head>
      <title>Next - Nextron (web-worker)</title>
    </Head>
    <div>
      <p>
        ⚡ Electron + Next.js ⚡ - <a href={resolve('home')}>Go to home page</a>
      </p>
    </div>
  </React.Fragment>
);
