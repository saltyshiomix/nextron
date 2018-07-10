import { resolve } from 'path'
import { existsSync } from 'fs'

export default function detectExtension(): 'js'|'ts' {
  if (existsSync(resolve(process.cwd(), 'tsconfig.json'))) {
    return 'ts'
  }
  return 'js'
}
