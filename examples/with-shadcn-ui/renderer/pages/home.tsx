import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-shadcn-ui)</title>
      </Head>
      <div className="flex justify-center pt-6">
        <Card className='w-96'>
          <CardHeader>
            <CardTitle>⚡ Nextron ⚡</CardTitle>
            <CardDescription>
              Nextron Example, with TypeScript, Tailwind CSS, and Shadcn UI.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Image src="/images/logo.png" alt="Nextron" width={120} height={120} />
          </CardContent>
          <CardFooter className='flex justify-end'>
            <Button>
              <Link href="/next">Go to Next page</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </React.Fragment>
  )
}
