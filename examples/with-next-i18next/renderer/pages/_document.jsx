import Document, { Head, Html, Main, NextScript } from 'next/document'
import i18next from '../../next-i18next.config.js'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang={i18next.i18n.defaultLocale}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
