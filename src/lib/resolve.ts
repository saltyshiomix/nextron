import { sep } from 'path'

export default function resolve(pathname: string): string {
  if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(pathname)) {
    return `..${sep}${pathname}`
  }
  return `..${sep}${pathname}${sep}index.html`
}
