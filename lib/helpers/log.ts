import chalk from 'chalk'

export const log = (text: string) => {
  console.log(chalk`{cyan [nextron]} ${text}`)
}
