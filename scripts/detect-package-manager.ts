import { promises as fs } from 'fs'
import { resolve } from 'path'
import { execa } from 'execa'

export type PM = 'npm' | 'yarn' | 'pnpm' | 'bun'

async function pathExists(p: string) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

const cache = new Map()

async function hasGlobalInstallation(pm: PM): Promise<boolean> {
  const key = `has_global_${pm}`
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key))
  }

  return execa(pm, ['--version'])
    .then((res) => {
      return /^\d+.\d+.\d+$/.test(res.stdout)
    })
    .then((value) => {
      cache.set(key, value)
      return value
    })
    .catch(() => false)
}

async function getTypeofLockFile(cwd = '.'): Promise<PM | null> {
  const key = `lockfile_${cwd}`
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key))
  }

  return Promise.all([
    pathExists(resolve(cwd, 'yarn.lock')),
    pathExists(resolve(cwd, 'package-lock.json')),
    pathExists(resolve(cwd, 'pnpm-lock.yaml')),
    pathExists(resolve(cwd, 'bun.lockb')),
  ]).then(([isYarn, isNpm, isPnpm, isBun]) => {
    let value: PM | null = null

    if (isYarn) {
      value = 'yarn'
    } else if (isPnpm) {
      value = 'pnpm'
    } else if (isBun) {
      value = 'bun'
    } else if (isNpm) {
      value = 'npm'
    }

    cache.set(key, value)
    return value
  })
}

export const detectPackageManager = async ({
  cwd,
  includeGlobalBun,
}: { cwd?: string; includeGlobalBun?: boolean } = {}) => {
  const type = await getTypeofLockFile(cwd)
  if (type) {
    return type
  }
  const [hasYarn, hasPnpm, hasBun] = await Promise.all([
    hasGlobalInstallation('yarn'),
    hasGlobalInstallation('pnpm'),
    includeGlobalBun && hasGlobalInstallation('bun'),
  ])
  if (hasYarn) {
    return 'yarn'
  }
  if (hasPnpm) {
    return 'pnpm'
  }
  if (hasBun) {
    return 'bun'
  }
  return 'npm'
}
