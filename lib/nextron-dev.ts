import fs from 'fs';
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
  '--no-sandbox': Boolean,
  '--disable-features': String,
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
  const { rendererSrcDir } = getNextronConfig();

  let firstCompile = true;
  let watching: webpack.Watching;
  let mainProcess: ChildProcess;
  let rendererProcess: ChildProcess;

  const startMainProcess = () => {
    const options: string[] = ['.', `${rendererPort}`];
    if (args['--no-sandbox']) {
      options.push('--no-sandbox');
    }

    if (args['--disable-features']) {
      options.push(`--disable-features=${args['--disable-features']}`)
    }

    mainProcess = spawn('electron', options, {
      detached: true,
      ...spawnOptions,
    });
    mainProcess.unref();
  };

  const startRendererProcess = () => {
    let child: ChildProcess;
    if (args['--custom-server']) {
      if (fs.existsSync('nodemon.json')) {
        child = spawn('nodemon', [args['--custom-server']], spawnOptions);
      } else {
        child = spawn('node', [args['--custom-server']], spawnOptions);
      }
    } else {
      child = spawn('next', ['-p', rendererPort, rendererSrcDir || 'renderer'], spawnOptions);
    }
    child.on('close', () => {
      process.exit(0);
    });
    return child;
  };

  const killWholeProcess = () => {
    if (watching) {
      watching.close(() => {});
    }
    if (mainProcess) {
      mainProcess.kill();
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

  watching = compiler.watch({}, async (err: any, stats: webpack.Stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
    }

    const info = stats.toJson('errors-warnings');
    if (stats.hasErrors()) {
      console.error(info.errors);
    }
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    if (firstCompile) {
      firstCompile = false;
    }

    if (!err && !stats.hasErrors()) {
      if (!firstCompile) {
        if (mainProcess) {
          mainProcess.kill();
        }
      }
      startMainProcess();
    }
  });
}

dev();
