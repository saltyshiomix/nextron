import fs from 'fs';
import path from 'path';
import {
  ChildProcess,
  SpawnSyncOptions,
} from 'child_process';
import arg from 'arg';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import delay from 'delay';
import webpack from 'webpack';
import {
  getNextronConfig,
  getWebpackConfig,
} from './webpack/helpers';

const args = arg({
  '--help': Boolean,
  '--version': Boolean,
  '--port': Number,
  '--custom-server': String,
  '-h': '--help',
  '-v': '--version',
  '-p': '--port',
  '-c': '--custom-server',
});

if (args['--help']) {
  console.log(chalk`
    {bold.cyan nextron dev} - Starts the nextron application in development mode

    {bold USAGE}

      {bold $} {cyan nextron dev} --help
      {bold $} {cyan nextron dev}

    {bold OPTIONS}

      --help,    -h  shows this help message
      --version, -v  displays the current version of nextron
  `);
  process.exit(0);
}

const rendererPort = args['--port'] || 8888;

const spawnOptions: SpawnSyncOptions = {
  cwd: process.cwd(),
  stdio: 'inherit',
};

async function dev() {
  const rendererSrcDir = getNextronConfig().rendererSrcDir || 'renderer';

  const startRendererProcess = () => {
    let child: ChildProcess;
    if (args['--custom-server']) {
      if (fs.existsSync('nodemon.json')) {
        child = spawn('nodemon', [args['--custom-server']], spawnOptions);
      } else {
        child = spawn('node', [args['--custom-server']], spawnOptions);
      }
    } else {
      child = spawn('next', ['-p', rendererPort, rendererSrcDir], spawnOptions);
    }
    child.on('close', () => {
      process.exit(0);
    });
    return child;
  };

  let watching: webpack.Watching;
  let rendererProcess: ChildProcess;
  const killWholeProcess = () => {
    if (watching) {
      watching.close(() => {});
    }
    if (rendererProcess) {
      rendererProcess.kill();
    }
  };

  process.on('SIGINT', killWholeProcess);
  process.on('SIGTERM', killWholeProcess);
  process.on('exit', killWholeProcess);

  rendererProcess = startRendererProcess();

  // wait until renderer process is ready
  await delay(8000);

  const compiler = webpack(getWebpackConfig('development'));
  let isHotReload = false;
  watching = compiler.watch({}, async (err, stats) => {
    if (!err && !stats.hasErrors()) {
      if (isHotReload) {
        await delay(2000);
      }
      isHotReload = true;
      spawn.sync('electron', ['.', `${rendererPort}`], spawnOptions);
    }
  });
}

dev();
