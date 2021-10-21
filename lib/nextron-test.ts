import fs from 'fs';
import arg from 'arg';
import chalk from 'chalk';
import execa from 'execa';
import path from 'path';
import kill from 'tree-kill'
import webpack, {Configuration} from 'webpack';

import {
  getNextronConfig,
  getWebpackConfig,
} from './webpack/helpers';

const cwd = process.cwd();

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '--port': Number,
  '--kill-render': Boolean,
  '--': Array,
  '-h': '--help',
  '-v': '--version',
  '-p': '--port',
});

if (args['--help']) {
  console.log(chalk`
    {bold.cyan nextron test} - Starts test suite for your nextron application

    {bold USAGE}
      {bold $} {cyan nextron test} --help
      {bold $} {cyan nextron test}

    {bold OPTIONS}

      --help,    -h  shows this help message
      --version, -v  displays the current version of nextron
  `);
  process.exit(0);
}

async function runWebpack(webpackConfig:Configuration):Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const compiler = webpack(webpackConfig);
    compiler.run(function(err) {
      if (err) reject(err);
      resolve();
    });
  });
}

function spawnTestBin(bin:string, args: any[]) {
  const testBin = execa(bin, args, {
    cwd,
    stdio: 'inherit',
    stripFinalNewline: true,
  });
  testBin.on('close', exitProcess(testBin));
  return testBin;
}

function exit(code:number|null, signal:NodeJS.Signals|null) {
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
}

function exitProcess(child:execa.ExecaChildProcess) {
  return function (code:number|null, signal:NodeJS.Signals|null)  {
    if (!child.killed) {
      child.kill(signal || undefined);
    }
    const pidPath = path.join(cwd, '.nextron.pid');
    const pid = Number(fs.readFileSync(pidPath).toString());
    if (args['--kill-render']) {
      kill(pid, () => {
        exit(code, signal);
      });
    } else {
      exit(code, signal);
    }
  }
}

async function main() {
  const rendererPort = args['--port'] || 8888;
  const {testBin, rendererSrcDir} = getNextronConfig();
  const webpackConfig = getWebpackConfig('development');
  require('./nextron-render').startRendererProcess(rendererSrcDir, rendererPort);
  if (!testBin) throw new Error('testBind is not specified in next.config.js');
  await runWebpack(webpackConfig);
  const child = spawnTestBin(testBin, args['--'] || []);
  process.on('SIGINT', exitProcess(child));
  process.on('SIGTERM', exitProcess(child));
  try {
    await child;
  } catch (e) {};
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
