import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from "next-i18next"

import LanguageSwitcher from "../../components/LanguageSwitcher"
import { getStaticPaths, makeStaticProperties } from "../../lib/get-static";

export default function HomePage() {
  const {i18n: {language: locale}, t} = useTranslation()
  const [message, setMessage] = React.useState(t("noMessageFound"))

  React.useEffect(() => {
    window.ipc.on('message', (message) => {
      console.log(message)
      setMessage(message)
    })
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>{`${t("common:home")} - Nextron (with nexti18next)`}</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link legacyBehavior passHref href={`/${locale}/next`}>
            <a>{t("common:goToNext")}</a>
          </Link>
        </p>
        <img
          src="/images/logo.png"
          alt="Logo image"
          width="256px"
          height="256px"
        />
      </div>
      <div>
        <button
          onClick={() => {
            window.ipc.send('message', 'Hello')
          }}
        >
          {t("common:testIPC")}
        </button>
        <p>{message}</p>
        <LanguageSwitcher/>
      </div>
    </React.Fragment>
  )
}

export const getStaticProps = makeStaticProperties(["common"]);

export {getStaticPaths};
