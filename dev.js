const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const chalk = require('chalk');

async function detectPackageManager() {
  let pm = 'yarn';
  try {
    await execa(pm, '-v');
  } catch (_) {
    pm = 'pnpm';
    try {
      await execa(pm, '-v');
    } catch (_ignore) {
      pm = 'npm';
      try {
        await execa(pm, '-v');
      } catch (_) {
        pm = undefined;
      }
    }
  }
  if (pm === undefined) {
    console.log(chalk.red('No available package manager! (`yarn`, `pnpm` or `npm` is needed)'));
    process.exit(1);
  }
  return pm;
}

(async () => {
  let example = 'with-javascript';
  if (3 <= process.argv.length) {
    const newExample = process.argv[2];
    if (!fs.existsSync(path.join(__dirname, `examples/${newExample}`))) {
      console.log(chalk.red(`Not found examples/${newExample}`));
      console.log('');
      process.exit(1);
    }
    example = newExample;
  }

  await fs.remove('workspace');

  await execa(
    'node',
    [
      path.join(__dirname, 'bin/nextron'),
      'init',
      'workspace',
      '--example',
      example,
    ],
    {
      stdio: 'inherit',
    },
  );

  const cwd = process.cwd();
  const pkg = path.join(cwd, 'workspace/package.json');
  const content = await fs.readJSON(pkg);
  content.devDependencies.nextron = cwd;
  await fs.writeJSON(pkg, {...content}, {spaces: 2});

  const pm = await detectPackageManager();
  await execa(pm, ['install'], {
    cwd: path.join(cwd, 'workspace'),
    stdio: 'inherit',
  });
  await execa(pm, ['run', 'dev'], {
    cwd: path.join(cwd, 'workspace'),
    stdio: 'inherit',
  });
})();
