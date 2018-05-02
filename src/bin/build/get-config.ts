import { join, resolve } from 'path'
import { pathExists, readJSON } from 'fs-extra'
import * as capitalize from 'capitalize'
import * as dotProp from 'dot-prop'
import * as dashify from 'dashify'
import * as spinner from '../../spinner'

export default async function getConfig(cwd: string): Promise<void> {
  const location = join(cwd, 'package.json')

  if (!await pathExists(location)) {
    spinner.fail('The `package.json` file doesn\'t exist')
    return
  }

  const winIcon = './main/static/windows.ico'

  const defaultConfig = {
    asar: true,
    macOS: {
      icon: './main/static/mac.icns'
    },
    windows: {
      icon: winIcon,
      setupIcon: winIcon
    }
  }

  let packageConfig

  try {
    packageConfig = await readJSON(location)
  } catch (err) {
    spinner.fail('Not able to read the `package.json` file')
    return
  }

  if (!packageConfig.version) {
    spinner.fail('Please specify `version` inside `package.json`')
    return
  }

  const config = Object.assign(defaultConfig, packageConfig.nextron || {}, {
    version: packageConfig.version
  })

  if (!config.name && packageConfig.name) {
    config.name = capitalize.words(packageConfig.name.replace('-', ' '))
  } else if (!packageConfig.name) {
    spinner.fail('Please set `name` or `nextron.name` inside `package.json`')
    return
  }

  config.slug = dashify(config.name)

  const toResolve = [
    'macOS.icon',
    'windows.icon',
    'windows.setupIcon'
  ]

  for (const property of toResolve) {
    const relative = dotProp.get(config, property)

    if (!relative) {
      continue
    }

    const full = resolve(cwd, relative)
    dotProp.set(config, property, full)
  }

  return config
}
