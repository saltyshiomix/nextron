const { remove, existsSync } = require('fs-extra');
const { resolve } = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

async function detectPackageManager() {
  const { promisify } = require('util');
  const { exec: defaultExec } = require('child_process');
  const cwd = process.cwd();
  const exec = promisify(defaultExec);

  let pm = 'yarn';
  try {
    await exec(`${pm} -v`, { cwd });
  } catch (_) {
    pm = 'pnpm';
    try {
      await exec(`${pm} -v`, { cwd });
    } catch (_ignore) {
      pm = 'npm';
      try {
        await exec(`${pm} -v`, { cwd });
      } catch (_) {
        pm = null;
      }
    }
  }

  if (pm === null) {
    console.log(chalk.red('No available package manager! (`yarn`, `pnpm` or `npm` is needed)'));
    process.exit(1);
  }

  return pm;
}

async function dev() {
  process.env.NODE_ENV = 'testing';

  let example = 'with-javascript';
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

  const pm = await detectPackageManager();
  execSync(`${pm} install && ${pm} run dev`, {
    cwd: resolve(__dirname, 'workspace'),
    stdio: 'inherit',
  });
}

dev();
