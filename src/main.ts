import * as electronIsDev from 'electron-is-dev'
import * as prepareNext from 'electron-next'

export async function prepareNextRenderer(rendererRelativePath: string): Promise<any> {
  return await prepareNext(rendererRelativePath)
}

export const isDev: boolean = electronIsDev
