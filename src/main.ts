import { format } from 'url'
import { join, parse } from 'path'
import * as isDev from 'electron-is-dev'
import { resolve } from 'app-root-path'
import { protocol, BrowserWindow } from 'electron'

const adjustProtocol = (directory) => {
  const paths: string[] = ['_next', 'static']
  const isWindows: boolean = process.platform === 'win32'

  protocol.interceptFileProtocol('file', (request, callback) => {
    let path: string = request.url.substr(isWindows ? 8 : 7)

    for (const replacement of paths) {
      if (!path.includes(replacement)) {
        continue
      }

      // Strip volume name from path on Windows
      if (isWindows) {
        path = path.replace(parse(path).root, '')
      }

      path = join(directory, 'out', path)
    }

    // Electron doesn't like anything in the path to be encoded,
    // so we need to undo that. This specifically allows for
    // Electron apps with spaces in their app names.
    path = decodeURIComponent(path)

    callback(path)
  })
}

let protocolSet = false

export function setWindow(page: string, instance: BrowserWindow) {
  const devPath = `http://localhost:5000/${page}`
  const renderer = resolve('renderer')

  if (isDev) {
    instance.loadURL(devPath)
    return
  }

  const prodPath = format({
    pathname: join(renderer, `out/${page}/index.html`),
    protocol: 'file:',
    slashes: true
  })

  // We only need to initialize the protocol once
  if (!protocolSet) {
    adjustProtocol(renderer)
    protocolSet = true
  }

  instance.loadURL(prodPath)
}
