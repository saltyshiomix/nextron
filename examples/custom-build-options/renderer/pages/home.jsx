import { resolve } from '../helpers'

export default () => (
  <div>
    <p>
      ⚡ Electron + Next.js ⚡ - <a href={resolve('next')}>To Next Page</a>
    </p>
    <img src={resolve('static/logo.png')} />
  </div>
)
