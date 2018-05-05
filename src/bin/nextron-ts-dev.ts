#!/usr/bin/env node

import { join } from 'path'
import { exec } from 'child_process'
import * as program from 'commander'

const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .parse(process.argv)

exec('node node_modules/nextron/build/typescript/start.js', { cwd: process.cwd() })
