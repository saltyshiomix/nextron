const { remove, existsSync } = require('fs-extra');
const { resolve } = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const { npxSync } = require('node-npx');
const delay = require('delay');

const stdio = 'inherit';
const workspace = resolve(__dirname, 'workspace');

async function installNextron() {
  npxSync('yalc', ['publish'], { stdio });

  npxSync('yalc', ['add', 'nextron'], {
    cwd: workspace,
    stdio,
  });

  for (let i = 0; i < 10; i++) {
    const { devDependencies: { nextron } } = require(resolve(workspace, 'package.json'));
    if (nextron === 'file:.yalc/nextron') {
      break;
    }
    if (10 <= i) {
      console.log('Failed to install nextron!');
      process.exit(1);
    }
    await delay(500);
  }
}

async function dev() {
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
    stdio,
  });

  await installNextron();

  execSync('yarn && yarn dev', {
    cwd: workspace,
    stdio,
  });
}

dev();
