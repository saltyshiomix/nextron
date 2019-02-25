import { LinkWithIpc } from '../helpers'

export default () => (
  <ul>
    <li>
      <LinkWithIpc href="blog/first">
        <a>My first blog post</a>
      </LinkWithIpc>
    </li>
    <li>
      <LinkWithIpc href="blog/second">
        <a>My second blog post</a>
      </LinkWithIpc>
    </li>
    <li>
      <LinkWithIpc href="blog/last">
        <a>My last blog post</a>
      </LinkWithIpc>
    </li>
  </ul>
)
