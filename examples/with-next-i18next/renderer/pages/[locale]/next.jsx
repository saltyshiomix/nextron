import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from "next-i18next"

import LanguageSwitcher from "../../components/LanguageSwitcher"
import { getStaticPaths, makeStaticProperties } from "../../lib/get-static"

export default function NextPage() {
  const {i18n: {language: locale}, t} = useTranslation()

  return (
    <React.Fragment>
      <Head>
          <title>{`${t("next")} - Nextron (with nexti18next)`}</title>
      </Head>
        <div>
            <p>
                ⚡ Electron + Next.js ⚡ -
            <Link legacyBehavior passHref href={`/${locale}/home`}>
                <a>{t("goToHome")}</a>
            </Link>
        </p>
          <LanguageSwitcher/>
      </div>
    </React.Fragment>
  )
}

export const getStaticProps = makeStaticProperties(["common"]);

export { getStaticPaths };