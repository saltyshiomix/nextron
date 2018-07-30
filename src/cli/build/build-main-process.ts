import { sep } from 'path'
import { npxSync as npx } from 'node-npx'

export default async function buildMainProcess(): Promise<void> {
  const cwd: string = process.cwd()
  await npx('webpack', [`--config=node_modules${sep}nextron${sep}dist${sep}cli${sep}webpack${sep}webpack.app.config.js`, '--env=production'], { cwd })
}
