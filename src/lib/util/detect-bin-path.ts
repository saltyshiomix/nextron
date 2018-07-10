import { existsSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'

export default function detectBinPath(name: string): string {
  const ext: string = process.platform === 'win32' ? '.cmd' : ''
  let binPath: string = resolve(`node_modules/.bin/${name}`)
  if (existsSync(binPath)) {
    return binPath + ext
  }

  binPath = resolve(`node_modules/nextron/node_modules/.bin/${name}`)
  if (existsSync(binPath)) {
    return binPath + ext
  }

  console.log(chalk.red(`[nextron] No such file or directory: ${name}`))
  process.exit(1)
}
