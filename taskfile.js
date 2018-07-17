module.exports = {
  *cleanDist(task) {
    yield task.clear('dist')
  },
  *cleanWorkspace(task) {
    yield task.clear('workspace')
  },
  *clean(task) {
    yield task.parallel(['cleanDist', 'cleanWorkspace'])
  },
  *tsc(task) {
    yield task.source('src/**/*.ts').typescript().target('dist', { mode: '0755' })
  },
  *toUnixFormat(task) {
    const isWindows = /^win/.test(process.platform)
    const isMac = process.platform === 'darwin'
    if (isWindows) {
      yield task.source('dist/**/*.js').shell('.\\bin\\dos2unix.exe $file && echo [dos2unix] $file')
    }
    if (isMac) {
      yield task.source('dist/**/*.js').shell('dos2unix -c Mac $file && echo [mac2unix] $file')
    }
  },
  *build(task) {
    yield task.serial(['clean', 'tsc', 'toUnixFormat'])
  }
}
