import fs from 'fs'
import path from 'path'

export const cwd = process.cwd()

export const pkg = require(path.join(cwd, 'package.json')) // eslint-disable-line @typescript-eslint/no-require-imports

export const isTs = fs.existsSync(path.join(cwd, 'tsconfig.json'))

export const ext = isTs ? '.ts' : '.js'

export const isEsm = pkg.type === 'module'

export const externals = pkg.dependencies
