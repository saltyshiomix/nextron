import { resolve } from '../helpers'

export default () => (
  <ul>
    <li><a href={resolve('blog/first')}>My first blog post</a></li>
    <li><a href={resolve('blog/second')}>My second blog post</a></li>
    <li><a href={resolve('blog/last')}>My last blog post</a></li>
  </ul>
)
