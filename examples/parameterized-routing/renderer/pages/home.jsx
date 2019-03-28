import React from 'react';
import Head from 'next/head';
import { LinkWithIpc } from '../helpers';

export default () => (
  <React.Fragment>
    <Head>
      <title>Home - Nextron (parameterized-routing)</title>
    </Head>
    <ul>
      <li>
        <LinkWithIpc href="blog/first">
          <a>My first blog post</a>
        </LinkWithIpc>
      </li>
      <li>
        <LinkWithIpc href="blog/second">
          <a>My second blog post</a>
        </LinkWithIpc>
      </li>
      <li>
        <LinkWithIpc href="blog/last">
          <a>My last blog post</a>
        </LinkWithIpc>
      </li>
    </ul>
  </React.Fragment>
);
