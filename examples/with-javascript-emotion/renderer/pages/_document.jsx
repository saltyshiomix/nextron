import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { css, Global } from '@emotion/core';

class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content={'user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height'} />
        </Head>
        <Global
          styles={css`
            html,
            body {
              padding: 1rem;
              margin: 0;
              background: papayawhip;
              min-height: 100%;
              font-family: Helvetica, Arial, sans-serif;
              font-size: 24px;
            }
          `}
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
