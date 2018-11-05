import React from 'react'
import { LinkWithIpc } from '../helpers'

export default class extends React.Component {
  static getInitialProps ({ query: { id } }) {
    return { id }
  }

  render () {
    return (
      <div>
        <h1>My {this.props.id} blog post</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <hr/>
        <p>Go back to <LinkWithIpc href="home"><a>Home</a></LinkWithIpc></p>
      </div>
    )
  }
}
