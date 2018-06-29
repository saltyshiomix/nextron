import { sep } from 'path'
import * as electronIsDev from 'electron-is-dev'
import * as electronNext from 'electron-next'

const isProd: boolean = process.env.NODE_ENV === 'production'

export function resolve(pathname: string): string {
  if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(pathname)) {
    return isProd ? `..${sep}${pathname}` : `/${pathname}`
  }
  return isProd ? `..${sep}${pathname}${sep}index.html` : `/${pathname}`
}

export function isDev() {
  return electronIsDev()
}

export function prepareNext(rendererDir: string) {
  return electronNext(rendererDir)
}
