import { join } from 'path'
import * as program from 'commander'
import build from './build'

const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .parse(process.argv)

build()
