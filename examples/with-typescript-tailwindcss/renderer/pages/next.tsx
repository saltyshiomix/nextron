import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

const Home = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div>
        <div className='grid grid-col-1 text-2xl w-full text-center'>
          <img className='ml-auto mr-auto' src='/images/logo.png' />
          <span>⚡ Electron ⚡</span>
          <span>+</span>
          <span>Next.js</span>
          <span>+</span>
          <span>tailwindcss</span>
          <span>=</span>
          <span>💕 </span>
        </div>
        <div className='mt-1 w-full flex-wrap flex justify-center'>
          <Link href='/home'>
            <a className='btn-blue'>Go to home page</a>
          </Link>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Home
