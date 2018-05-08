#!/usr/bin/env node

import { join } from 'path'
import * as program from 'commander'
import ScriptType from '../ScriptType'
import build from './build/perform-build'

const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .parse(process.argv)

build(ScriptType.JavaScript)
