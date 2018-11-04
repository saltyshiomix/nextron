module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main/background.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./main/addPython.ts":
/*!***************************!*\
  !*** ./main/addPython.ts ***!
  \***************************/
/*! exports provided: addPython */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addPython", function() { return addPython; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);


const PY_DIST_FOLDER = "pythondist";
const PY_FOLDER = "python";
const PY_MODULE = "api"; // without .py suffix
let pyProc = null;
let pyPort = null;
const guessPackaged = () => {
    const fullPath = path__WEBPACK_IMPORTED_MODULE_1__["join"](__dirname, PY_DIST_FOLDER);
    return __webpack_require__(/*! fs */ "fs").existsSync(fullPath);
};
const getScriptPath = () => {
    if (!guessPackaged()) {
        console.log("TODO DEBUG guessing electron is not packaged");
        return path__WEBPACK_IMPORTED_MODULE_1__["join"](__dirname, PY_FOLDER, PY_MODULE + ".py");
    }
    console.log("TODO DEBUG guessing electron is packaged");
    if (process.platform === "win32") {
        return path__WEBPACK_IMPORTED_MODULE_1__["join"](__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE + ".exe");
    }
    return path__WEBPACK_IMPORTED_MODULE_1__["join"](__dirname, PY_DIST_FOLDER, PY_MODULE, PY_MODULE);
};
const selectPort = () => {
    pyPort = 4242;
    return pyPort;
};
const createPyProc = () => {
    const script = getScriptPath();
    const port = "" + selectPort();
    pyProc = (guessPackaged()) ? __webpack_require__(/*! child_process */ "child_process").execFile(script, [port]) : __webpack_require__(/*! child_process */ "child_process").spawn("python", [script, port]);
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
    electron__WEBPACK_IMPORTED_MODULE_0__["app"].on("ready", createPyProc);
    electron__WEBPACK_IMPORTED_MODULE_0__["app"].on("will-quit", exitPyProc);
};



/***/ }),

/***/ "./main/background.ts":
/*!****************************!*\
  !*** ./main/background.ts ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _addPython__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./addPython */ "./main/addPython.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers */ "./main/helpers/index.ts");





const env = __webpack_require__(/*! env */ "./main/env/development.json");
const isProd = (env.name === "production");
if (!isProd) {
    Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["enableHotReload"])();
    const userDataPath = electron__WEBPACK_IMPORTED_MODULE_0__["app"].getPath("userData");
    electron__WEBPACK_IMPORTED_MODULE_0__["app"].setPath("userData", `${userDataPath} (${env.name})`);
}
Object(_addPython__WEBPACK_IMPORTED_MODULE_3__["addPython"])();
electron__WEBPACK_IMPORTED_MODULE_0__["app"].on("ready", () => {
    const mainWindow = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["createWindow"])("main", {
        height: 600,
        width: 1000,
    });
    const homeUrl = isProd ? Object(url__WEBPACK_IMPORTED_MODULE_2__["format"])({
        pathname: Object(path__WEBPACK_IMPORTED_MODULE_1__["join"])(__dirname, "home/index.html"),
        protocol: "file:",
        slashes: true,
    }) : "http://localhost:8888/home";
    mainWindow.loadURL(homeUrl);
    // if (!isProd) {
    //   mainWindow.webContents.openDevTools();
    // }
});
electron__WEBPACK_IMPORTED_MODULE_0__["app"].on("window-all-closed", () => {
    electron__WEBPACK_IMPORTED_MODULE_0__["app"].quit();
});


/***/ }),

/***/ "./main/env/development.json":
/*!***********************************!*\
  !*** ./main/env/development.json ***!
  \***********************************/
/*! exports provided: name, default */
/***/ (function(module) {

module.exports = {"name":"development"};

/***/ }),

/***/ "./main/helpers/create-window.ts":
/*!***************************************!*\
  !*** ./main/helpers/create-window.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs-jetpack */ "fs-jetpack");
/* harmony import */ var fs_jetpack__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs_jetpack__WEBPACK_IMPORTED_MODULE_1__);


/* harmony default export */ __webpack_exports__["default"] = ((name, options) => {
    const userDataDir = fs_jetpack__WEBPACK_IMPORTED_MODULE_1__["cwd"](electron__WEBPACK_IMPORTED_MODULE_0__["app"].getPath("userData"));
    const stateStoreFile = `window-state-${name}.json`;
    const defaultSize = {
        height: options.height,
        width: options.width,
    };
    let state = {};
    let win;
    const restore = () => {
        let restoredState = {};
        try {
            restoredState = userDataDir.read(stateStoreFile, "json");
        }
        catch (err) {
            // For some reason json can't be read (might be corrupted).
            // No worries, we have defaults.
        }
        return Object.assign({}, defaultSize, restoredState);
    };
    const getCurrentPosition = () => {
        const position = win.getPosition();
        const size = win.getSize();
        return {
            height: size[1],
            width: size[0],
            x: position[0],
            y: position[1],
        };
    };
    const windowWithinBounds = (windowState, bounds) => {
        return (windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height);
    };
    const resetToDefaults = () => {
        const bounds = electron__WEBPACK_IMPORTED_MODULE_0__["screen"].getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2,
        });
    };
    const ensureVisibleOnSomeDisplay = (windowState) => {
        const visible = electron__WEBPACK_IMPORTED_MODULE_0__["screen"].getAllDisplays().some((display) => {
            return windowWithinBounds(windowState, display.bounds);
        });
        if (!visible) {
            // Window is partially or fully not visible now.
            // Reset it to safe defaults.
            return resetToDefaults();
        }
        return windowState;
    };
    const saveState = () => {
        if (!win.isMinimized() && !win.isMaximized()) {
            Object.assign(state, getCurrentPosition());
        }
        userDataDir.write(stateStoreFile, state, { atomic: true });
    };
    state = ensureVisibleOnSomeDisplay(restore());
    const browserOptions = {
        ...options,
        ...state,
    };
    win = new electron__WEBPACK_IMPORTED_MODULE_0__["BrowserWindow"](browserOptions);
    win.on("close", saveState);
    return win;
});


/***/ }),

/***/ "./main/helpers/enable-hot-reload.ts":
/*!*******************************************!*\
  !*** ./main/helpers/enable-hot-reload.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return enableHotReload; });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);



function enableHotReload() {
    Object(fs__WEBPACK_IMPORTED_MODULE_1__["watchFile"])(Object(path__WEBPACK_IMPORTED_MODULE_2__["join"])(process.cwd(), "app/background.js"), () => {
        electron__WEBPACK_IMPORTED_MODULE_0__["app"].relaunch();
        electron__WEBPACK_IMPORTED_MODULE_0__["app"].exit(0);
    });
}


/***/ }),

/***/ "./main/helpers/index.ts":
/*!*******************************!*\
  !*** ./main/helpers/index.ts ***!
  \*******************************/
/*! exports provided: createWindow, enableHotReload */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _create_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-window */ "./main/helpers/create-window.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createWindow", function() { return _create_window__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _enable_hot_reload__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./enable-hot-reload */ "./main/helpers/enable-hot-reload.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "enableHotReload", function() { return _enable_hot_reload__WEBPACK_IMPORTED_MODULE_1__["default"]; });






/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "fs-jetpack":
/*!*****************************!*\
  !*** external "fs-jetpack" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs-jetpack");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ })

/******/ });
//# sourceMappingURL=background.js.map