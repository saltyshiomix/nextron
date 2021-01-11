import '../styles/index.css'
import Head from 'next/head'
const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Home - Nextron (with-javascript-tailwindcss)</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
