import chalk from 'chalk';

export default function log(text: string) {
  console.log(chalk`{cyan [nextron]} ${text}`);
}
