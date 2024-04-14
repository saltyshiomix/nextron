import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [launcherUrl, setLauncherUrl] = React.useState('')

  React.useEffect(() => {
    ;(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { api } = window as any

      api.onLauncherUrl((url: string) => {
        setLauncherUrl(url)
      })

      api.setWindowIsReady(true)
    })()
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (basic-launch-app-from-url)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <Link href="/next">Go to next page</Link>
        </p>
        {launcherUrl && <p>Welcome back from URL: {launcherUrl}</p>}
        <Image
          src="/images/logo.png"
          alt="Logo image"
          width={256}
          height={256}
        />
      </div>
    </React.Fragment>
  )
}
