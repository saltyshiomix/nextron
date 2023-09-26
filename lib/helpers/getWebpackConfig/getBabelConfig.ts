import fs from 'fs'
import path from 'path'

const cwd = process.cwd()

export const getBabelConfig = (): string | undefined => {
  if (fs.existsSync(path.join(cwd, '.babelrc')))
    return path.join(cwd, '.babelrc')
  if (fs.existsSync(path.join(cwd, '.babelrc.js')))
    return path.join(cwd, '.babelrc.js')
  if (fs.existsSync(path.join(cwd, 'babel.config.js')))
    return path.join(cwd, 'babel.config.js')
  return path.join(__dirname, '../babel.js')
}
