import * as ora from 'ora'
import chalk from 'chalk'
import { prompt as corePrompt } from 'inquirer'

const cache: any = {}
const isTTY: boolean = process.env.CI ? false : process.stdout.isTTY

export function create(text: string): void {
  if (!isTTY) {
    console.log(`[nextron] ${text}`)
    return
  }

  const { spinner } = cache
  if (spinner) {
    spinner.succeed()
    delete cache.spinner
  }

  cache.spinner = ora({
    text,
    color: 'magenta'
  }).start()
}

export function clear(message: string, isError?: boolean): void {
  if (!isTTY) {
    console.log(`[nextron] ${message}`)
    return
  }

  const { spinner } = cache
  if (spinner) {
    (isError ? spinner.fail() : spinner.succeed())
    delete cache.spinner
    console.log('')
  }

  const prefix = isError ? chalk.red('Error!') : chalk.green('Done!')
  console.log(`${prefix} ${message}`)
}

export function fail(message: string): void {
  clear(message, true)
  process.exit(1)
}

export async function prompt(message: string): Promise<boolean> {
  if (!isTTY) {
    return true
  }

  const { spinner } = cache
  if (spinner) {
    spinner.succeed()
    delete cache.spinner
    console.log('')
  }

  const answers: any = await corePrompt([
    {
      type: 'confirm',
      message,
      name: 'check'
    }
  ])
  return answers.check
}
