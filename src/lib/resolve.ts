import { sep } from 'path'

const isProd: boolean = process.env.NODE_ENV === 'production'

export default function resolve(pathname: string): string {
  if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(pathname)) {
    return isProd ? `..${sep}${pathname}` : `/${pathname}`
  }
  return isProd ? `..${sep}${pathname}${sep}index.html` : `/${pathname}`
}
