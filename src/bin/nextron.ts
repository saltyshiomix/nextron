#!/usr/bin/env node

import { join } from 'path'
import * as program from 'commander'

const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .command('dev', 'Development', { isDefault: true })
  .command('build', 'Build')
  .command('init', 'Init')
  .parse(process.argv)
