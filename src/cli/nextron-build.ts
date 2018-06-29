#!/usr/bin/env node

import * as parseArgs from 'minimist'
import build from './build'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: ['h']
})

if (argv.help) {
  console.log(`
    Description
      Build and export the application for production deployment

    Usage
      $ nextron build

    Options
      --help, -h    list this help
  `)
  process.exit(0)
}

build()
