const { remove, existsSync } = require('fs-extra');
const { resolve } = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

async function dev() {
  process.env.NODE_ENV === 'testing';

  let example = 'with-typescript';
  if (3 <= process.argv.length) {
    const newExample = process.argv[2];
    if (!existsSync(resolve(__dirname, `examples/${newExample}`))) {
      console.log(chalk.red(`Not found examples/${newExample}`));
      console.log('');
      process.exit(1);
    }
    example = newExample;
  }

  await remove('workspace');

  execSync('node ' + resolve(__dirname, 'bin/nextron') + ` init workspace --example ${example}`, {
    cwd: __dirname,
    stdio: 'inherit',
  });

  execSync('yarn && yarn dev', {
    cwd: resolve(__dirname, 'workspace'),
    stdio: 'inherit',
  });
}

dev();
