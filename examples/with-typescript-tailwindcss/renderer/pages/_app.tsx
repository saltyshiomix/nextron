import type { AppProps } from 'next/app'
import '../styles/index.css'
import Head from 'next/head'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
