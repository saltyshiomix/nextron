function createArchArgs(argv: any): string[] {
  let archArgs: string[] = []
  argv.x64 && (archArgs.push('--x64'))
  argv.ia32 && (archArgs.push('--ia32'))
  argv.armv7l && (archArgs.push('--armv7l'))
  argv.arm64 && (archArgs.push('--arm64'))
  return archArgs
}

export default function createBuilderArgs(argv: any): string[] {
  let args: string[] = []
  if (argv.all) {
    args.push('-wml')
    args.push(...createArchArgs(argv))
  } else {
    argv.win && (args.push('--win'))
    argv.mac && (args.push('--mac'))
    argv.linux && (args.push('--linux'))
    args.push(...createArchArgs(argv))
  }
  return args
}