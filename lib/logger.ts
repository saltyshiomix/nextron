import chalk from 'chalk'

export const info = (text: string) => {
  console.log(chalk`{cyan [nextron]} ${text}`)
}

export const error = (message: string) => {
  console.log(chalk`{cyan [nextron]} {red ${message}}`)
}
