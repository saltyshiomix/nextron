import { resolve } from 'nextron'

export default () =>
  <div>
    <p>⚡ Electron + Next.js ⚡</p>
    <a href={resolve('home')}>
      To Home Page
    </a>
  </div>
