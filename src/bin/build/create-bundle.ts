import { join, relative, sep } from 'path'
import { exec as defaultExec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs-extra'
import * as asar from 'asar'
import * as globby from 'globby'
import os from './os'
import * as spinner from '../../spinner'

const pack = (dest, files) => new Promise(async resolve => {
  const stats = {}

  for (const file of files) {
    const stat = await fs.stat(file)

    stats[file] = {
      type: stat.isDirectory() ? 'directory': 'file',
      stat
    }
  }

  asar.createPackageFromFiles(process.cwd(), dest, files, stats, {}, resolve)
})

const clear = async (directory, files) => {
  const removers = []

  for (const file of files) {
    const location = join(directory, file)
    removers.push(fs.remove(location))
  }

  return Promise.all(removers)
}

const getDependencies = async (cwd: string): Promise<Set<string>> => {
  // We need to ensure to make the process always
  // succeed, since npm is putting a lot of useless
  // errors into stderr.
  const command = 'npm ls --prod --parseable --silent || exit 0'
  const exec = promisify(defaultExec)

  let stdout

  try {
    ({ stdout } = await exec(command, { cwd }))
  } catch (err) {
    spinner.fail('Not able to run `npm ls` properly')
    return
  }

  const list = stdout.split('\n').map(dependency => {
    const path = relative(cwd, dependency)
    const parts = path.split(sep)
    const { length } = parts

    if (length <= 2) {
      return path
    }

    if (path.includes('@') && length <= 3) {
      return parts.slice(0, 2).join(sep)
    }

    return false
  })

  return new Set(list.filter(Boolean))
}

export default async function createBundle(workingDir, outputDir, config) {
  spinner.create(`Bundling application for ${os}`)

  const include: string[] = [
    'main',
    `renderer${sep}out`,
    'package.json',
    ...await getDependencies(workingDir)
  ]

  const remove = [
    'default_app.asar'
  ]

  const isWin = process.platform === 'win32'
  const main = join(outputDir, isWin ? 'electron' : `${config.name}.app`)
  const parent = join(main, isWin ? 'resources' : 'Contents/Resources')
  const target = join(parent, config.asar ? 'app.asar' : 'app')

  if (config.asar) {
    // The items within this collection won't be walked. Not their
    // contents will be included – only their actual representation
    // in the file system.
    const files = [
      'renderer',
      'node_modules',
      ...await globby(include, { nodir: false })
    ]

    // Create the `.asar` bundle with all necessary files
    await pack(target, files)
  } else {
    const copiers = []

    for (const path of include) {
      const from = join(workingDir, path)
      const to = join(target, path)

      copiers.push(fs.copy(from, to))
    }

    // Copy all files into place, without an `.asar` archive
    await Promise.all(copiers)
  }

  if (!isWin) {
    const icon = {
      origin: config.macOS.icon,
      target: join(parent, `${config.slug}.icns`)
    }

    await fs.copy(icon.origin, icon.target)
  }

  // Remove any useless files from the bundle
  await clear(parent, remove)

  return main
}
