import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

class Page extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Head>
          <title>Home - Nextron (with-typescript-python-api)</title>
        </Head>

        <div>
          <style>{`
            .container {
              position: absolute;
              top: 30%;
              left: 10px;
            }

            .container h2 {
              font-size: 5rem;
            }

            .container a {
              font-size: 1.4rem;
            }

            .container ol {
              padding-left: 20px;
            }
          `}</style>
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
