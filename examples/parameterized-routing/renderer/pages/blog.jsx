import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const codec = require('json-url')('lzw');

const Blog = ({ id, title }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title} - Nextron (parameterized-routing)</title>
      </Head>
      <div>
        <h1>{title} (id: {id})</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua.
        </p>
        <hr />
        <p>
          Back to{' '}
          <Link href="/home">
            <a>home</a>
          </Link>
        </p>
      </div>
    </React.Fragment>
  );
};

Blog.getInitialProps = async ({ query }) => {
  return codec.decompress(query.props);
};

export default Blog;
