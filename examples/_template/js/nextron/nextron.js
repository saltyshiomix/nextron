#!/usr/bin/env node

const { resolve } = require('path');
const { spawn } = require('cross-spawn');
const chalk = require('chalk');

const defaultCommand = 'dev';
const commands = new Set([
  'build',
  defaultCommand,
]);

let cmd = process.argv[2];
let args = [];
let nodeArgs = [];

const inspectArg = process.argv.find(arg => arg.includes('--inspect'));
if (inspectArg) {
  nodeArgs.push(inspectArg);
}

if (new Set(['--help', '-h']).has(cmd)) {
  console.log(chalk`
    {bold.cyan nextron} - Build an Electron + Next.js app for speed ⚡

    {bold USAGE}

      {bold $} nextron <command>

    {bold AVAILABLE COMMANDS}

      ${Array.from(commands).join(', ')}

    For more information run a command with the --help flag

      {bold $} nextron build --help
  `);
  process.exit(0);
}

if (commands.has(cmd)) {
  args = process.argv.slice(3);
} else {
  cmd = defaultCommand;
  args = process.argv.slice(2);
}

const defaultEnv = cmd === 'dev' ? 'development' : 'production';
process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv;

const cli = resolve(__dirname, `nextron-${cmd}`);

const startProcess = () => {
  const proc = spawn('node', [...nodeArgs, ...[cli], ...args], { stdio: 'inherit', customFds: [0, 1, 2] });
  proc.on('close', (code, signal) => {
    if (code !== null) {
      process.exit(code);
    }
    if (signal) {
      if (signal === 'SIGKILL') {
        process.exit(137);
      }
      process.exit(1);
    }
    process.exit(0);
  });
  proc.on('error', (err) => {
    console.error(err);
    process.exit(1);
  });
  return proc;
}

const proc = startProcess();

const wrapper = () => {
  if (proc) {
    proc.kill();
  }
}
process.on('SIGINT', wrapper);
process.on('SIGTERM', wrapper);
process.on('exit', wrapper);
