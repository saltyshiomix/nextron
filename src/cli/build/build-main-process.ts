import { sep } from 'path'
import npx from 'node-npx'

export default async function buildMainProcess(): Promise<void> {
  const cwd: string = process.cwd()
  npx('webpack', [`--config=node_modules${sep}nextron${sep}dist${sep}cli${sep}webpack${sep}webpack.app.config.js`, '--env=production'], { cwd })
}
