#!/usr/bin/env node

const { join } = require('path')
const { copy, remove, readFileSync, writeFileSync } = require('fs-extra')
const arg = require('arg')
const chalk = require('chalk')
const fg = require('fast-glob')
const { npxSync: npx } = require('node-npx')
const spinner = require('./spinner')

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '--all': Boolean,
  '--win': Boolean,
  '--mac': Boolean,
  '--linux': Boolean,
  '--x64': Boolean,
  '--ia32': Boolean,
  '--armv7l': Boolean,
  '--arm64': Boolean,
  '-h': '--help',
  '-v': '--version',
  '-w': '--win',
  '-m': '--mac',
  '-l': '--linux'
})

if (args['--help']) {
  console.log(chalk`
    {bold.cyan nextron build} - Build and export the application for production deployment

    {bold USAGE}

      {bold $} {cyan nextron build} --help
      {bold $} {cyan nextron build} [options]

    {bold OPTIONS}

      --help,    -h  shows this help message
      --version, -v  displays the current version of nextron
      --all          builds for Windows, macOS and Linux
      --win,     -w  builds for Windows, accepts target list (see https://goo.gl/jYsTEJ)
      --mac,     -m  builds for macOS, accepts target list (see https://goo.gl/5uHuzj)
      --linux,   -l  builds for Linux, accepts target list (see https://goo.gl/4vwQad) 
      --x64          builds for x64
      --ia32         builds for ia32
      --armv7l       builds for armv7l
      --arm64        builds for arm64
  `)
  process.exit(0)
}

async function build(args) {
  // Ignore missing dependencies
  process.env.ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = 'true'

  const cwd = process.cwd()

  try {
    spinner.create('Clearing previous builds')
    await remove(join(cwd, 'app'))
    await remove(join(cwd, 'dist'))

    spinner.create('Building renderer process')
    const outdir = join(cwd, 'renderer/.next')
    const appdir = join(cwd, 'app')
    await npx('next', ['build', 'renderer'], { cwd })
    await npx('next', ['export', 'renderer'], { cwd })
    await copy(outdir, appdir)
    await remove(outdir)
    const pages = fg.sync(join(appdir, '**/*.html'))
    pages.forEach(page => {
      writeFileSync(page, resolveExportedPaths(page))
    })

    spinner.create('Building main process')
    await npx('node', [join('build/webpack/build.production.js')], { cwd })

    spinner.create('Packaging - please wait a moment')
    await npx('electron-builder', createBuilderArgs(args), { cwd })

    spinner.clear('See `dist` directory')
  } catch (err) {
    spinner.fail('Cannot build electron packages. Please contact <shiono.yoshihide@gmail.com>.')
    console.log(err)
    process.exit(1)
  }
}

function resolveExportedPaths(page) {
  const content = readFileSync(page).toString()
  const depth = page.split('/app/')[1].split('/').length - 1
  return content
    .replace(/"\/_next\//g, `"${resolveDepth('next', depth)}`)
    .replace(/"\/_error\//g, `"${resolveDepth('error', depth)}`)
}

function resolveDepth(name, depth) {
  return `${'../'.repeat(depth)}_${name}/`
}

function createBuilderArgs(args) {
  let results = []
  if (args['--all']) {
    results.push('-wml')
    results.push(...createArchArgs(args))
  } else {
    args['--win'] && (results.push('--win'))
    args['--mac'] && (results.push('--mac'))
    args['--linux'] && (results.push('--linux'))
    results.push(...createArchArgs(args))
  }
  return results
}

function createArchArgs(args) {
  let archArgs = []
  args['--x64'] && (archArgs.push('--x64'))
  args['--ia32'] && (archArgs.push('--ia32'))
  args['--armv7l'] && (archArgs.push('--armv7l'))
  args['--arm64'] && (archArgs.push('--arm64'))
  return archArgs
}

build(args)
