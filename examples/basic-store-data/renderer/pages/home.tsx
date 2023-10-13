import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [message, setMessage] = React.useState('')
  const [messages, setMessages] = React.useState([])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    window.ipc.send('add-message', message)
    setMessages([...messages, message])
    setMessage('')
  }

  React.useEffect(() => {
    window.ipc.on('messages', (messages: string[]) => {
      setMessages(messages)
    })

    window.ipc.send('get-messages')
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (basic-store-data)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
        </p>
        <Image
          src="/images/logo.png"
          alt="Logo image"
          width="256px"
          height="256px"
        />
        <hr />
        <h2>Enter your message:</h2>
        <form onSubmit={onSubmit}>
          <input type="text" value={message} onChange={onChange} />
        </form>
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  )
}
