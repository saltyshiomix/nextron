import React from 'react';
import Head from 'next/head';
import { LinkWithIpc } from '../helpers';

export default () => (
  <React.Fragment>
    <Head>
      <title>Next - Nextron (ipc-communication)</title>
    </Head>
    <div>
      <p>
        ⚡ Electron + Next.js ⚡ - <LinkWithIpc href="home"><a>Go to home page</a></LinkWithIpc>
      </p>
    </div>
  </React.Fragment>
);
