function createArchArgs(argv: any): string {
  let archArgs: string = ''
  argv.x64 && (archArgs += '--x64 ')
  argv.ia32 && (archArgs += '--ia32 ')
  argv.armv7l && (archArgs += '--armv7l ')
  argv.arm64 && (archArgs += '--arm64 ')
  return archArgs
}

export default function createBuilderArgs(argv: any): string {
  let args: string = ''
  if (argv.all) {
    args += '-wml ' + createArchArgs(argv)
  } else {
    argv.win && (args += '--win ')
    argv.mac && (args += '--mac ')
    argv.linux && (args += '--linux ')
    args += createArchArgs(argv)
  }
  return args
}