import fs from 'fs';
import path from 'path';
import execa from "execa";

const cwd = process.cwd();

const pidPath = path.join(cwd, '.nextron.pid');

const rendererPort = process.argv[2];
const rendererSrcDir = process.argv[3];

const execaOptions: execa.Options = {
  cwd,
  stdio: 'inherit',
};

const writePID = (pid:number) => {
  fs.writeFileSync(pidPath, pid.toString());
}

const clearPID = () => {
  fs.rmSync(pidPath);
}

const getPID = () => {
  return Number(fs.readFileSync(pidPath));
}

const isRenderProcessRunning = () => {
  try {
    const pid = getPID();
    return pid;
  } catch (e) {
    return 0;
  }
}

const isRunning = isRenderProcessRunning();

(async () => {
  if (!isRunning) {
    const child = execa(
      'next',
      ['-p', `${rendererPort}`, rendererSrcDir || 'renderer'],
      {
        detached: true,
        ...execaOptions
      },
      );
      child.on('SIGINT', clearPID);
      child.on('SIGTERM', clearPID);
      child.on('exit', clearPID);
      child.on('close', clearPID);
      writePID(child.pid);
      await child;
  }
})();
