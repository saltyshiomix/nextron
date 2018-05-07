export default function resolve(pathname) {
  if (process.env.NODE_ENV === 'production') {
    const { sep } = require('path')
    return `..${sep}${pathname}${sep}index.html`
  }
  return '/' + pathname
}
