import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default () => (
  <React.Fragment>
    <Head>
      <title>Home - Nextron (parameterized-routing)</title>
    </Head>
    <ul>
      <li>
        <Link href="/blog/first">
          <a>My first blog post</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/second">
          <a>My second blog post</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/last">
          <a>My last blog post</a>
        </Link>
      </li>
    </ul>
  </React.Fragment>
);
