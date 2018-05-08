import { exec } from 'child_process'
import ScriptType from '../../ScriptType'

export default function dev(scriptType: ScriptType): void {
  exec(`node node_modules/nextron/build/${scriptType}/start.js`, { cwd: process.cwd() })
}
