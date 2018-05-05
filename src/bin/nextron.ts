#!/usr/bin/env node

import { join } from 'path'
import * as program from 'commander'

const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .command('dev', 'Start development process', { isDefault: true })
  .command('build', 'Build the electron app for release')
  .command('init', 'Init scaffolds for first electron + next.js app')
  .parse(process.argv)
