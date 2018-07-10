module.exports = {
  *tsc(task) {
    yield task.source('src/**/*.ts').typescript().target('dist', { mode: '0755' })
  },
  *build(task) {
    yield task.clear('dist').clear('workspace').start('tsc')
  },
  *release(task) {
    yield task.clear('dist').start('tsc')
  }
}
