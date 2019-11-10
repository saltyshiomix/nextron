import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import arg from 'arg';
import chalk from 'chalk';
import log from './logger';

const cwd = process.cwd();

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '--template': String,
  '--example': '--template',
  '-h': '--help',
  '-v': '--version',
  '-t': '--template',
  '-e': '--template',
});

if (args['--version']) {
  const pkg = require(path.resolve(__dirname, '../package.json'));
  console.log(`nextron v${pkg.version}`);
  process.exit(0);
}

if (args['--help'] || (!args._[0])) {
  console.log(chalk`
    {bold.cyan nextron} - ⚡ Electron + NEXT.js ⚡

    {bold USAGE}

      {bold $} {cyan nextron init} --help
      {bold $} {cyan nextron init} {underline my-app}
      {bold $} {cyan nextron init} {underline my-app} [--example {underline example_folder_name}]

    {bold OPTIONS}

      --help,    -h                      shows this help message
      --version, -v                      displays the current version of nextron
      --example, -e {underline example_folder_name}  sets the example as a template
  `);
  process.exit(0);
}

function detectPackageManager() {
  let pm: string | undefined = 'yarn';
  try {
    execSync(`${pm} -v`, { cwd });
  } catch (_) {
    pm = 'pnpm';
    try {
      execSync(`${pm} -v`, { cwd });
    } catch (_ignore) {
      pm = 'npm';
      try {
        execSync(`${pm} -v`, { cwd });
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

const example = args['--template'] || args['--example'] || 'with-javascript-material-ui';
if (!fs.existsSync(path.resolve(__dirname, `../examples/${example}`))) {
  console.log(chalk.red(`Not found examples/${example}`));
  process.exit(1);
}

function init(name: string) {
  log('Copy template');
  const ext = fs.existsSync(path.resolve(__dirname, `../examples/${example}/tsconfig.json`)) ? 'ts' : 'js';
  fs.copySync(path.resolve(__dirname, `../examples/_template/gitignore.txt`), path.join(cwd, `${name}/.gitignore`));
  fs.copySync(path.resolve(__dirname, `../examples/_template/${ext}`), path.join(cwd, name));
  fs.copySync(path.resolve(__dirname, `../examples/${example}`), path.join(cwd, name));

  log('Set meta information');
  const pkg = path.resolve(cwd, `${name}/package.json`);
  const content = fs.readJSONSync(pkg);
  content.name = name;
  if (process.env.NODE_ENV === 'testing') {
    content.devDependencies.nextron = cwd;
  }
  fs.writeJSONSync(pkg, {...content}, {spaces: 2});

  let cmd: string;
  const pm = detectPackageManager();
  switch (pm) {
    case 'yarn':
      cmd = 'yarn && yarn dev';
      break;
    case 'pnpm':
      cmd = 'pnpm install && pnpm run dev';
      break;
    default:
      cmd = 'npm install && npm run dev';
      break;
  }
  log(`Run \`${cmd}\` inside of "${name}" to start the app`);
}

init(args._[0] || 'my-nextron-app');
