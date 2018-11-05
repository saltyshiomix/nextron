import React from 'react'
import { resolveWithIpc, LinkWithIpc } from '../helpers'

export default class extends React.Component {
  state = {
    logo: null
  }

  componentDidMount() {
    this.setState({
      logo: resolveWithIpc('static/logo.png')
    })
  }

  render() {
    return (
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <LinkWithIpc href="next"><a>To Next Page</a></LinkWithIpc>
        </p>
        <img src={this.state.logo} />
      </div>
    )
  }
}
