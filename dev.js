const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const chalk = require('chalk');

const cwd = process.cwd();

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
    if (!fs.existsSync(path.join(cwd, `examples/${newExample}`))) {
      console.log(chalk.red(`Not found examples/${newExample}`));
      console.log('');
      process.exit(1);
    }
    example = newExample;
  }

  await fs.remove('workspace');

  const ext = fs.existsSync(path.resolve(cwd, `examples/${example}/tsconfig.json`)) ? 'ts' : 'js';
  await fs.copy(path.resolve(cwd, `examples/_template/gitignore.txt`), path.join(cwd, 'workspace/.gitignore'));
  await fs.copy(path.resolve(cwd, `examples/_template/${ext}`), path.join(cwd, 'workspace'));
  await fs.copy(path.resolve(cwd, `examples/${example}`), path.join(cwd, 'workspace'));

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
