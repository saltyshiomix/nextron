import { join } from 'path'
import { promisify } from 'util'
import { exec as defaultExec } from 'child_process'
import * as spinner from '../../spinner'

export default async function exportRenderer(): Promise<void> {
  spinner.create('Building renderer code')

  const cwd = process.cwd()
  const renderer = join(cwd, 'renderer')
  const exec = promisify(defaultExec)

  let stderr

  try {
    ({ stderr } = await exec(`npx next build ${renderer}`, { cwd }))
  } catch (err) {
    spinner.fail('Not able to build renderer code')
    return
  }

  if (stderr && !stderr.includes('must be of type')) {
    console.error(stderr)
    process.exit(1)
  }

  spinner.create('Generating static bundle from renderer code')

  try {
    ({ stderr } = await exec(`next export ${renderer}`, { cwd }))
    // ({ stderr } = await exec(`npx next export ${renderer}`, { cwd }))
  } catch (err) {
    spinner.fail('Not able to export renderer code')
    return
  }

  if (stderr && !stderr.includes('must be of type')) {
    console.error(stderr)
    process.exit(1)
  }
}
