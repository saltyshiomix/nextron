import { join } from 'path'
import * as program from 'commander'
import init from './init'

let appName
const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .arguments('<name>')
  .action(function(name) {
    appName = name
  })

program.parse(process.argv)

if (typeof appName === 'undefined') {
  appName = 'my-nextron-app'
}

init(appName)
