#!/usr/bin/env node

import { join } from 'path'
import * as program from 'commander'
import ScriptType from '../ScriptType'
import dev from './dev/perform-dev'

const pkg = require(join(__dirname, '../../package.json'))

program
  .version(pkg.version)
  .parse(process.argv)

dev(ScriptType.TypeScript)
