import '../styles/home.less';
import { resolve } from '../helpers';

export default () => (
  <div className='home'>
    <p>
      ⚡ Electron + Next.js ⚡ - <a href={resolve('next')}>Go to next page</a>
    </p>
    <img src={resolve('static/logo.png')} />
  </div>
);
