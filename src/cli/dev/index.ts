import { resolve } from 'path'
import { exec } from 'child_process'
import detectScriptType from '../detect-script-type'

export default function dev(): void {
  exec(`node ${resolve('node_modules/nextron/build', detectScriptType(), 'start.js')}`, {
    cwd: process.cwd()
  })
}
