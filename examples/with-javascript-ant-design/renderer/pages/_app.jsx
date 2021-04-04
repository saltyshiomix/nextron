import React from 'react';
import Head from 'next/head';

import 'antd/dist/antd.css';

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default MyApp;
