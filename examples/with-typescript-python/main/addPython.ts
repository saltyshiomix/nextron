import { app } from "electron";
import * as path from "path";

const PY_DIST_FOLDER = "pythondist";
const PY_FOLDER = "python";
const PY_MODULE = "api"; // without .py suffix

let pyProc = null;
let pyPort = null;

const guessPackaged = () => {
  const fullPath = path.join(__dirname, PY_DIST_FOLDER);
  return require("fs").existsSync(fullPath);
};

const getScriptPath = () => {
  if (!guessPackaged()) {
    console.log("TODO DEBUG guessing electron is not packaged");
    return path.join(__dirname, PY_FOLDER, PY_MODULE + ".py");
  }
  console.log("TODO DEBUG guessing electron is packaged");
  if (process.platform === "win32") {
    return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + ".exe");
  }
  return path.join(__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE);
};

const selectPort = () => {
  pyPort = 4242;
  return pyPort;
};

const createPyProc = () => {
  const script = getScriptPath();
  const port = "" + selectPort();

  pyProc = (guessPackaged()) ? require("child_process").execFile(script, [port]) : require("child_process").spawn("python", [script, port]);

  if (pyProc != null) {
    console.log("child process success on port " + port);
  }
};

const exitPyProc = () => {
  pyProc.kill();
  pyProc = null;
  pyPort = null;
};

const addPython = () => {
  app.on("ready", createPyProc);
  app.on("will-quit", exitPyProc);
};

export { addPython };
