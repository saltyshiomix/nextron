import Document, { Head, Main, NextScript } from 'next/document'
import { resolve } from 'nextron'

export default class MyDocument extends Document {
  render () {
    return (
      <html>
        <Head>
          <link rel='stylesheet' href={resolve('_next/static/css/styles.chunk.css')} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
