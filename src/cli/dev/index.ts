import { sep } from 'path'
import { exec } from 'child_process'
import detectScriptType from '../detect-script-type'

export default function dev(): void {
  exec(`node node_modules${sep}nextron${sep}build${sep}${detectScriptType()}${sep}start.js`, {
    cwd: process.cwd()
  })
}
