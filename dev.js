const { remove, existsSync } = require('fs-extra');
const { resolve } = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

async function dev() {
  let template = 'with-javascript-emotion';
  if (3 <= process.argv.length) {
    const newTemplate = process.argv[2];
    if (!existsSync(resolve(__dirname, `examples/${newTemplate}`))) {
      console.log(chalk.red(`Not found examples/${newTemplate}`));
      console.log('');
      process.exit(1);
    }
    template = newTemplate;
  }

  await remove('workspace');
  execSync('node ' + resolve(__dirname, `bin/nextron init workspace --example ${template}`), {
    cwd: __dirname,
    stdio: 'inherit',
  });
  execSync('cd workspace');
  execSync('yarn && yarn dev', {
    cwd: resolve(__dirname, 'workspace'),
    stdio: 'inherit',
  });
}

dev();
