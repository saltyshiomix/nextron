export default function resolve(pathname: string): string {
  if (process.env.NODE_ENV === 'production') {
    const { sep } = require('path')
    return `..${sep}${pathname}${sep}index.html`
  }
  return '/' + pathname
}
