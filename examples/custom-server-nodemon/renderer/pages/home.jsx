import { resolve } from '../helpers';

export default () => (
  <div>
    <p>
      ⚡ Electron + Next.js ⚡ - <a href={resolve('next')}>Go to next page</a>
    </p>
    <img src={resolve('static/logo.png')} />
  </div>
);
