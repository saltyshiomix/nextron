import Link from "next/link"
import React, {useEffect} from "react"
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";

import i18next from "../../next-i18next.config"

const localeNames = {
  de: "Deutsch",
  en: "English"
}
export default function LanguageSwitcher() {
  const {i18n: {language: locale}} = useTranslation()
  const {pathname} = useRouter()

  useEffect(() => {
    window.ipc.setLocale(locale)
    console.log("locale:", locale)
  }, [locale])

  return (
    <div style={{display: "flex", gap: "0.5rem"}}>
      {i18next.i18n.locales.map(locale_ => {
        return (
          <Link key={locale_} legacyBehavior passHref href={pathname.replace("[locale]", locale_)}>
            <a>{localeNames[locale_]}</a>
          </Link>
        )
      })}
    </div>
  )
}
