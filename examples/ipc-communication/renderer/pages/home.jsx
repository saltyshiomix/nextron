import React from 'react'
import electron from 'electron'
import { resolveWithIpc, LinkWithIpc } from '../helpers'

export default class extends React.Component {
  // prevent SSR webpacking
  ipcRenderer = electron.ipcRenderer || false

  state = {
    logo: null,
    ipcResult: 'no ipc messaging'
  }

  componentDidMount() {
    this.setState({
      logo: resolveWithIpc('static/logo.png')
    })
  }

  onClickWithIpc = () => {
    if (this.ipcRenderer) {
      this.ipcRenderer.send('ping-pong', 'some data from ipcRenderer')
      this.ipcRenderer.on('ping-pong', (event, data) => {
        this.setState({
          ipcResult: data
        })
      })
    }
  }

  onClickWithIpcSync = () => {
    if (this.ipcRenderer) {
      this.setState({
        ipcResult: this.ipcRenderer.sendSync('ping-pong-sync', 'some data from ipcRenderer')
      })
    }
  }

  render() {
    return (
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <LinkWithIpc href="next"><a>To Next Page</a></LinkWithIpc>
        </p>
        <img src={this.state.logo} />
        <hr />
        <button onClick={this.onClickWithIpc}>IPC messaging</button>
        <button onClick={this.onClickWithIpcSync}>IPC messaging (sync)</button>
        <p>{this.state.ipcResult}</p>
      </div>
    )
  }
}
