import chalk from 'chalk'
import { sleep } from 'sleep'

export default async function waitRendererProcess() {
  const MAX_RETRY_COUNT: number = 30
  let i
  for (i = 0; i < MAX_RETRY_COUNT; i++) {
    sleep(1)
    if (0 <= process.stdout.toString().indexOf('> Ready on http://localhost:8888')) {
      break
    }
  }
  if (i === MAX_RETRY_COUNT - 1) {
    console.log(chalk.red('Cannot prepare renderer process!'))
    process.exit(1)
  }
}
