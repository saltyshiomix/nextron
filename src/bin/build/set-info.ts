import * as fs from 'fs-extra'
import * as path from 'path'
import * as walk from 'klaw'
import * as dotProp from 'dot-prop'
import * as plist from 'plist'

const getReplacables = (directory: string) => new Promise<{meta: string[], toRename: string[]}>((resolve) => {
  const paths = {
    meta: [],
    toRename: []
  }

  const filter = item => path.extname(item) !== '.framework'
  const walker = walk(directory, { filter })

  walker.on('data', item => {
    const { name, ext } = path.parse(item.path)

    if (ext === '.plist') {
      paths.meta.push(item.path)
      return
    }

    if (!name.match(/electron/i) || ext === '.asar') {
      return
    }

    paths.toRename.push(item.path)
  })

  walker.on('end', resolve.bind(this, paths))
})

const levelCount = (location) => {
  return location.match(new RegExp('/', 'g') || []).length
}

const sortByLevels = (paths) => paths.sort((a, b) => {
  return levelCount(b) - levelCount(a)
})

const fixName = (oldName, { name, slug }) => {
  return String(oldName).replace(/electron/i, match => {
    const isLowerCase = match === match.toLowerCase()
    return isLowerCase ? slug : name
  })
}

const rename = async (paths, config) => {
  // This ensures we start from the deepest level and
  // then move up the the highest one. In turn, there won't
  // be any conflicts.
  const files = sortByLevels(paths)

  // Each file that's being renamed needs to
  // block the loop. Otherwise multiple renamings
  // happen simultaneously and it doesn't work.
  for (const file of files) {
    const details = path.parse(file)
    const newName = fixName(details.name, config)

    details.base = details.base.replace(details.name, newName)
    details.name = newName

    const newPath = path.format(details)
    await fs.rename(file, newPath)
  }
}

const plistMatches = {
  CFBundleVersion: 'version',
  CFBundleShortVersionString: 'version',
  CFBundleDisplayName: 'name',
  CFBundleExecutable: 'name',
  CFBundleName: 'name',
  CFBundleIdentifier: 'macOS.id',
  LSApplicationCategoryType: 'macOS.category'
}

const setDetails = async (files, config) => {
  const savers = []

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')
    const parsed = plist.parse(content)

    for (const match in plistMatches) {
      if (!parsed[match]) {
        continue
      }

      if (parsed[match].includes('Helper')) {
        parsed[match] = fixName(parsed[match], config)
        continue
      }

      const value = dotProp.get(config, plistMatches[match])

      if (value) {
        parsed[match] = value
      }
    }

    if (dotProp.has(config, 'macOS.info')) {
      const { info } = config.macOS

      for (const property in info) {
        parsed[property] = info[property]
      }
    }

    parsed.CFBundleIconFile = `${config.slug}.icns`

    savers.push(fs.writeFile(file, plist.build(parsed)))
  }

  await Promise.all(savers)
}

export default async function setInfo(output: string, config: any): Promise<void> {
  if (process.platform !== 'darwin') {
    return
  }
  
  const { meta, toRename } = await getReplacables(output)
  await setDetails(meta, config)
  await rename(toRename, config)
}
