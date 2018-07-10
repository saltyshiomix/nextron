import { join } from 'path'

export default function resolve(pathname: string): string {
  if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(pathname)) {
    return join(`../${pathname}`)
  }
  return join(`../${pathname}/index.html`)
}
