#!/usr/bin/env node

import * as parseArgs from 'minimist'
import dev from './dev'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: ['h']
})

if (argv.help) {
  console.log(`
    Description
      Starts the nextron application in development mode

    Usage
      $ nextron dev

    Options
      --help, -h  Displays this message
  `)
  process.exit(0)
}

dev()
