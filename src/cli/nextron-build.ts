#!/usr/bin/env node

import * as parseArgs from 'minimist'
import build from './build'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    w: 'win',
    m: 'mac',
    l: 'linux',
    h: 'help'
  },
  boolean: [
    'w',
    'm',
    'l',
    'all',
    'x64',
    'ia32',
    'armv7l',
    'arm64',
    'h'
  ]
})

if (argv.help) {
  console.log(`
    Description
      Build and export the application for production deployment

    Usage
      $ nextron build [options]

    Options
      --all        Build for Windows, macOS and Linux
      --win,   -w  Build for Windows, accepts target list (see https://goo.gl/jYsTEJ)
      --mac,   -m  Build for macOS, accepts target list (see https://goo.gl/5uHuzj)
      --linux, -l  Build for Linux, accepts target list (see https://goo.gl/4vwQad) 
      --x64        Build for x64
      --ia32       Build for ia32
      --armv7l     Build for armv7l
      --arm64      Build for arm64
      --help,  -h  List this help
  `)
  process.exit(0)
}

build(argv)
