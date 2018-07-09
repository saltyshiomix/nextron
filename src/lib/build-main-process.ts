import { sep } from 'path'
import { execSync } from 'child_process'
import detectPM from './detect-pm'

export default async function buildMainProcess(): Promise<void> {
  const pm: 'yarn'|'npm' = await detectPM()
  const cwd: string = process.cwd()
  let webpack: string
  if (process.env.NODE_ENV === 'testing') {
    webpack = pm === 'yarn' ? `node_modules${sep}.bin${sep}webpack` : `node_modules${sep}nextron${sep}node_modules${sep}.bin${sep}webpack`
  } else {
    webpack = `node_modules${sep}.bin${sep}webpack`
  }
  await execSync(`${webpack} --config=node_modules${sep}nextron${sep}dist${sep}webpack${sep}webpack.app.config.js --env=production`, { cwd })
}
