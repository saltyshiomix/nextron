import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { css } from './styles.css';

class Page extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Head>
          <title>Home - Nextron (with-typescript-python-api)</title>
        </Head>

        <div>
          <style>{css}</style>
          <div className="container">
            <h2>Home</h2>
            <ol>
              <li><Link href="/calculator">Open calculator page</Link></li>
            </ol>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Page;
