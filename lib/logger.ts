import chalk from 'chalk';

const log = (text: string) => {
  console.log(chalk`{cyan [nextron]} ${text}`);
};

export default log;
