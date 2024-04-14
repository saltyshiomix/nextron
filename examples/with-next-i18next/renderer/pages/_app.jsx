import { appWithTranslation } from 'next-i18next'

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(App)
