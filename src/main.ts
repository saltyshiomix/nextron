import * as electronIsDev from 'electron-is-dev'
import * as prepareNext from 'electron-next'

export const isDev: boolean = electronIsDev

export async function prepareNextRenderer(rendererRelativePath: string): Promise<any> {
  return await prepareNext(rendererRelativePath)
}

export function resolve(pathname: string): string {
  if (process.env.NODE_ENV === 'production') {
    const { sep } = require('path')
    return `..${sep}${pathname}${sep}index.html`
  }
  return '/' + pathname
}
