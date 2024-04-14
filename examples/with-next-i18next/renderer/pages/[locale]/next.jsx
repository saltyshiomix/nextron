import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

import LanguageSwitcher from '../../components/LanguageSwitcher'
import { getStaticPaths, makeStaticProperties } from '../../lib/get-static'

export default function NextPage() {
  const {
    i18n: { language: locale },
    t,
  } = useTranslation()

  return (
    <React.Fragment>
      <Head>
        <title>{`${t('next')} - Nextron (with-next-i18next)`}</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href={`/${locale}/home`}>{t('goToHome')}</Link>
        </p>
        <LanguageSwitcher />
      </div>
    </React.Fragment>
  )
}

export const getStaticProps = makeStaticProperties(['common'])

export { getStaticPaths }
