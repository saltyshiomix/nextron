import { sep } from 'path'

const isProd: boolean = process.env.NODE_ENV === 'production'

export function resolve(pathname: string): string {
  return isProd ? `..${sep}${pathname}${sep}index.html` : `/${pathname}`
}
