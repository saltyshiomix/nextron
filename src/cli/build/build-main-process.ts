import { sep } from 'path'
import { spawn } from 'cross-spawn'
import detectBinPath from '../../lib/util/detect-bin-path'

export default async function buildMainProcess(): Promise<void> {
  const cwd: string = process.cwd()
  await spawn.sync(detectBinPath('webpack'), [`--config=node_modules${sep}nextron${sep}dist${sep}cli${sep}webpack${sep}webpack.app.config.js`, '--env=production'], { cwd })
}
