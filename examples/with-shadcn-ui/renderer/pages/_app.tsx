import React from 'react'
import type { AppProps } from 'next/app'

import '../styles/globals.css'
import { Inter as FontSans } from "next/font/google"
import { cn } from '@/lib/utils'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
      <Component {...pageProps} />
    </main>
  )
}

export default MyApp
