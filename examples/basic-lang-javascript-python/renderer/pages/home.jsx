import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [log, setLog] = React.useState('')
  const [value, setValue] = React.useState('5')
  const [message, setMessage] = React.useState('')

  const handleChange = (event) => {
    setValue(event.target.value)
    setMessage('')
  }

  React.useEffect(() => {
    window.ipc.on('log', (log) => {
      setLog(log)
    })
    window.ipc.on('message', (msg) => {
      setMessage(msg)
    })
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (basic-lang-javascript-python)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <Link href="/next">Go to next page</Link>
        </p>
        <Image
          src="/images/logo.png"
          alt="Logo image"
          width={256}
          height={256}
        />
      </div>
      <div>
        <p>
          Calculate the sqaure of your number:
          <input type="number" value={value} onChange={handleChange} />
        </p>
        <button
          onClick={() => {
            window.ipc.send('run-sh', value)
          }}
        >
          Test running the Python script via IPC
        </button>
        <p>{log}</p>
        <p>
          the square of {value} is {'-> '} {message}
        </p>
      </div>
    </React.Fragment>
  )
}
