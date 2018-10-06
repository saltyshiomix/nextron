import { sep } from 'path'
import { npxSync as npx } from 'node-npx'

export default async function buildMainProcess(): Promise<void> {
  const cwd: string = process.cwd()
  await npx('node', [`node_modules${sep}nextron${sep}build${sep}production.js`], { cwd })
}
