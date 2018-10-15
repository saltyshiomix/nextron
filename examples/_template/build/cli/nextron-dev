#!/usr/bin/env node

const { resolve } = require('path')
const arg = require('arg')
const chalk = require('chalk')

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '-h': '--help',
  '-v': '--version'
})

if (args['--help']) {
  console.log(chalk`
    {bold.cyan nextron dev} - Starts the nextron application in development mode

    {bold USAGE}

      {bold $} {cyan nextron dev} --help
      {bold $} {cyan nextron dev}

    {bold OPTIONS}

      --help,    -h  shows this help message
      --version, -v  displays the current version of nextron
  `)
  process.exit(0)
}

async function dev() {
  const delay = require('delay')
  const { npx, npxSync } = require('node-npx')
  const webpack = require('webpack')
  const config = require('./webpack.main.config')
  const cwd = process.cwd()

  const startRendererProcess = () => {
    const child = npx('next', ['-p', '8888', 'renderer'], { cwd, stdio: 'inherit' })
    child.on('close', () => {
      process.exit(0)
    })
    return child
  }

  let watching
  let rendererProcess
  const killWholeProcess = () => {
    if (watching) {
      watching.close()
    }
    if (rendererProcess) {
      rendererProcess.kill()
    }
  }

  process.on('SIGINT', killWholeProcess)
  process.on('SIGTERM', killWholeProcess)
  process.on('exit', killWholeProcess)

  rendererProcess = startRendererProcess()

  // wait for ready (renderer process)
  await delay(8000)

  let electronStarted = false
  const compiler = webpack(config('development'))
  watching = compiler.watch({}, async (err, stats) => {
    if (!err && !stats.hasErrors() && !electronStarted) {
      electronStarted = true
      await npxSync('electron', ['.'], { cwd, stdio: 'inherit' })
    }
  })
}

dev()
