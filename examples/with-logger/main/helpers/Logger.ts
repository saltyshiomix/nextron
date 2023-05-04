const path = require("path");
const fs = require("fs");
import test from "../../package.json";
import { ipcMain } from "electron";
import { app } from "electron";

export const LOGGER_CODES = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  FATAL: 4,
};

export const LOGGER_SOURCE = {
  BACK: 0,
  FRONT: 1,
  LOGGER: 2,
};

export function getNameFromCode(code, enumeration) {
  for (let prop in enumeration) {
    if (enumeration[prop] === code) {
      return prop;
    }
  }
}

export class Logger {
  static _instance: Logger;
  isDev: boolean;
  todayCode: string;
  logFileName: string;
  fileExtension: any;
  fileIdentifier: string;
  logFolder: any;
  numberOfLogFilesAccepted: any;
  static build(opts) {
    if (!Logger._instance) Logger._instance = new Logger(opts);
  }

  static get() {
    if (!Logger._instance) throw "Error, logger not instanciated !";
    return Logger._instance;
  }

  constructor(opts) {
    this.isDev = opts.isDev || false;
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, "0");
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = currentDate.getFullYear();

    this.todayCode = `${yyyy}-${mm}-${dd}`;
    this.fileExtension = opts.fileExtension || "txt";
    this.fileIdentifier = opts.fileIdentifier || test.name;
    this.logFolder =
      opts.logFolder ||
      path.join(app.getPath("documents"), this.fileIdentifier);
    this.logFileName =
      this.fileIdentifier + this.todayCode + "." + this.fileExtension;
    this.numberOfLogFilesAccepted = opts.numberOfLogFilesAccepted || 3;
    this.writeLog(
      LOGGER_SOURCE.LOGGER,
      LOGGER_CODES.INFO,
      `Oppening application :${this.fileIdentifier}`,
    );

    this.setLogListener();

    this.deletePastLogFiles();
  }

  deletePastLogFiles() {
    var lastlogFiles = this.getAllLogsFiles();
    lastlogFiles.sort((a, b) => a.date.localeCompare(b.date));

    while (lastlogFiles.length >= this.numberOfLogFilesAccepted) {
      var currentPath = lastlogFiles.shift().path;
      if (fs.existsSync(currentPath)) {
        fs.unlink(currentPath, (err) => {
          if (err) {
            this.writeLog(
              LOGGER_SOURCE.LOGGER,
              LOGGER_CODES.ERROR,
              "An error ocurred deleting the file" + err.message
            );
            return;
          }
          this.writeLog(
            LOGGER_SOURCE.LOGGER,
            LOGGER_CODES.INFO,
            "Old log successfully deleted"
          );
        });
      } else {
        this.writeLog(
          LOGGER_SOURCE.LOGGER,
          LOGGER_CODES.WARNING,
          "Log file does not exist, cannot delete."
        );
      }
    }
    return;
  }

  getAllLogsFiles() {
    const logFolder = this.logFolder;
    if (!fs.existsSync(logFolder)) {
      fs.mkdirSync(logFolder);
    }

    const allFiles = fs.readdirSync(logFolder);
    let lastlogFiles = [];
    if (allFiles.length >= this.numberOfLogFilesAccepted)
      for (let i = 0; i < allFiles.length; i++) {
        if (
          !(
            allFiles[i].startsWith(this.fileIdentifier) &&
            allFiles[i].length ===
              this.fileIdentifier.length +
                this.todayCode.length +
                this.fileExtension.length
          )
        )
          continue;

        const currentFileDate = allFiles[i].substring(
          this.fileIdentifier.length,
          this.fileIdentifier.length + this.todayCode.length
        );
        lastlogFiles.push({
          filename: allFiles[i],
          date: currentFileDate,
          path: path.join(logFolder, allFiles[i]),
        });
      }
    return lastlogFiles;
  }

  writeLog(source, code, content) {
    const currentDate = new Date();
    const ss = currentDate.getSeconds();
    const mm = currentDate.getMinutes();
    const hh = currentDate.getHours();
    const currentTime = `${hh}:${mm}:${ss}`;

    const sourceName = getNameFromCode(source, LOGGER_SOURCE);
    const codeName = getNameFromCode(code, LOGGER_CODES);
    content =`[${this.todayCode}]:[${currentTime}]:[${sourceName)}]:[${codeName}]:${content}`;
    const logFolder = this.logFolder;
    if (!fs.existsSync(logFolder)) {
      fs.mkdirSync(logFolder);
    }
    fs.writeFileSync(
      path.join(logFolder, this.logFileName),
      `${content}\n`,
      { flag: "a+" },
      function (err) {
        if (err) throw err;
      }
    );
    if (this.isDev) console.log(content);
  }

  setLogListener() {
    ipcMain.on("loggerKey", (event, { source, code, content }) => {
      this.writeLog(source, code, content);
    });
  }
}

const isProd = process.env.NODE_ENV === "production";

Logger.build({ isDev: !isProd });
