const { resolve } = require('path')
const { execSync } = require('child_process')
const fg = require('fast-glob')

function convToUnixFormat() {
  const isWindows = /^win/.test(process.platform)
  if (!isWindows) {
    return
  }

  const cwd = process.cwd()
  const files = fg.sync('dist/**/*', { cwd })
  files.forEach(function(file) {
    execSync(`.\\bin\\dos2unix.exe ${file}`, { cwd })
  })
}

module.exports = {
  *cleanDist(task) {
    yield task.clear('dist')
  },
  *cleanWorkspace(task) {
    yield task.clear('workspace')
  },
  *tsc(task) {
    yield task.source('src/**/*.ts').typescript().target('dist', { mode: '0755' })
  },
  *toUnixFormat(task) {
    convToUnixFormat()
  },
  *chmod755(task) {
    yield task.target('dist/cli/nextron*.js', { mode: '0755' })
  },
  *build(task) {
    yield task.serial(['cleanDist', 'cleanWorkspace', 'tsc', 'toUnixFormat', 'chmod755'])
  },
  *release(task) {
    yield task.serial(['cleanDist', 'tsc', 'toUnixFormat', 'chmod755'])
  }
}
