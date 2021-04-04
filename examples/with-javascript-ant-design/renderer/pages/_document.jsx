import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head>
          <meta charSet='utf-8' />
          <title>Home - Nextron (with-typescript-ant-design)</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
};
