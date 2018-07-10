import { existsSync } from 'fs'
import { sep } from 'path'
import chalk from 'chalk'

export default function detectBinPath(name: string): string {
  const ext: string = process.platform === 'win32' ? '.cmd' : ''
  let binPath: string = `node_modules${sep}.bin${sep}${name}`
  if (existsSync(binPath)) {
    return binPath + ext
  }

  binPath = `node_modules${sep}nextron${sep}node_modules${sep}.bin${sep}${name}`
  if (existsSync(binPath)) {
    return binPath + ext
  }

  console.log(chalk.red(`[nextron] No such file or directory: ${name}`))
  process.exit(1)
}
