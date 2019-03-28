import React from 'react';
import Head from 'next/head';
import { resolve } from '../helpers';

export default () => (
  <React.Fragment>
    <Head>
      <title>Home - Nextron (with-typescript)</title>
    </Head>
    <div>
      <p>
        ⚡ Electron + Next.js ⚡ - <a href={resolve('next')}>Go to next page</a>
      </p>
      <img src={resolve('static/logo.png')} />
    </div>
  </React.Fragment>
);
