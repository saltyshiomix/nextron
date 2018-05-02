import { join } from 'path'
import { createServer } from 'http'
import * as spinner from '../../spinner'

export default async function prepareRenderer() {
  const cwd = process.cwd()
  let next

  try {
    const path = require.resolve('next', {
      paths: [
        join(cwd, 'node_modules')
      ]
    })

    next = require(path)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      spinner.fail(`Your project is missing the ${'`next`'} dependency`)
    }
    spinner.fail(`Not able to load the ${'`next`'} dependency`)
  }

  const dir = join(cwd, 'renderer')
  const instance = next({ dev: true, dir })
  const requestHandler = instance.getRequestHandler()

  await instance.prepare()

  const server = createServer(requestHandler)
  server.listen(5000)
}
