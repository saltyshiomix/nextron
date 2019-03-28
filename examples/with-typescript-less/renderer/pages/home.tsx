import React from 'react';
import Head from 'next/head';
import { resolve } from '../helpers';

import '../styles/home.less';

export default () => (
  <React.Fragment>
    <Head>
      <title>Home - Nextron (with-typescript-less)</title>
    </Head>
    <div className='home'>
      <p>
        ⚡ Electron + Next.js ⚡ - <a href={resolve('next')}>Go to next page</a>
      </p>
      <img src={resolve('static/logo.png')} />
    </div>
  </React.Fragment>
);
