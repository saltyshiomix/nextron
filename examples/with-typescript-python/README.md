# Nextron as a GUI for Python Applications

**NOTE - This is a work in progress - see the paragraph of notes at the end of this file for a discussion of the last step of the loading process that this is currently blocked by**

This example builds a stand-alone Electron application into `./nextronpy-win32-x64/` (on windows, or into a similar folder OSX or Linux). You can change the name of the application by changing the "name" property in `package.json`.

NOTE: On windows you will need to [install anaconda](https://www.anaconda.com/download/) (which installs python and pip) and potentially configure environment variables to add python and/or pip to the path if you don't have it installed already.

**VERY IMPORTANT:** If you are on Windows and use VS Code or like Powershell, you need to type `cmd` inside the VS Code terminal or inside your Powershell window before running these commands because the conda environment switcher doesnt work under Powershell (much of it works, and the critical parts that don't work, like activating evironments, fail silently while appearing to work),

The approach here is based on [fyear's electron-python-example](https://github.com/fyears/electron-python-example) and leverages [saltyshiomix's nextron](https://github.com/saltyshiomix/nextron)

# Installation

```bash
# start with the obvious step you always need to do with node projects
npm install

# then rebuild the downloaded zeromq node binary for the target platform. To do this,
# look through https://iojs.org/download/release/ for the version closest to your
# electron version number (which can be found in packages-lock.json), 
# for example electron 3.0.7 would use --target=3.0.0
npm rebuild zeromq --runtime=electron --target=3.0.0

# and then rebuild for the correct installed version of node.js (there is
# presumbably some way to do this and the previous step as one operation)
npm rebuild
```

```bash
# install Anaconda if not already installed

# run the following commands from the Windows CMD prompt (-not- Powershell) or an OSX or Linux terminal. VS Code uses powershell on windows so you need to type cmd to get into command prompt
conda env create -f environment.yml
conda activate nextron-python-sample
conda env list # make sure the nextron-python-sample is activated (under Powershell on Windows the activate command fails silently so you need to run in a cmd prompt)
```

# Running and changing and iterating

**Please read:** This project requires Python, and it requires a predictable set of libraries to be 
installed for Python, via the conda commands above. When you run npm commands like
`npm run dev` you need to be in a conda-activated terminal window (`conda activate nextron-python-sample`). On Windows, that means you **cannot be in a powershell window** because conda doesn't work with powershell.
If you use VS Code on windows, that means you need to manually type `cmd` in your integrated
terminal editor to turn the powershell editor into an old-school command window. Then do `conda activate nextron-python-sample` and you're all set to run your favorite npm commands as described below.

```bash
# please read the notes above about running conda activate and about running under VS Code

# did you read the notes? these lines wont work without the notes above

# run the unpackaged python scripts from a dev build of electron
npm run dev # note the first time you run you will probably need to use the electron menu to refresh

# use pyinstaller to convert the source code in python/ into an executable in pythondist/
npm run python

# build the production electron application
npm run build

# package the application into a single file
npm run package
```

# Debugging

To test the intermediate steps, run `python python/api.py` in one conda environment'ed terminal window. Then **in another conda environment'ed terminal**, run the following command to see the result:

```bash
zerorpc tcp://localhost:4242 calc "1 + 1"
## connecting to "tcp://localhost:4242"
## 2.0
```

After debugging, **remember to terminate the Python function**.

# Notes

The electron main process spawns the Python child process and creates the window. The electron renderer process and python backend communicate with each other using `zerorpc`.

The Python script `python/calc.py` provides a function: `calc(text)` that can take text like `1 + 1 / 2` and returns the result like `1.5`.

Launching the Python code in electron is tricky because of the different locations of the Python executable. The python executable is managed by `main/addPython.ts`. Before the Python code is packaged, it will `spawn` the Python script. After it is packaged it will `execFile` the generated executable.

Electron doesn't seem to provide functions to check whether the app is under distributed or not so `addPython.ts` checks whether the `*dist` folder has been generated or not. If generated, it means we are in "production" mode and should `execFile` the executable directly; otherwise it will `spawn` the script using a Python shell. This is a pretty brittle way to check for packaging, and requires that the npm commands used to run the app always delete the dist folder before starting to run.

# Additional notes while trying to get this sample working

## The problem: The renderer isn't loading the zerorpc client file
There is a node binary which needs to be loaded for this sample to work (`node_modules/zeromq/build/Release/zmq.node`, which is required by `zerorpc`). [fyear's original Electron + Python example](https://github.com/fyears/electron-python-example) didn't seem to need any special handling for this, but I found I needed to modify `/renderer/next.config.js` to add the `native-ext-loader` to webpack in order to get nextron to load the `node_modules/zeromq/build/Release/zmq.node` node binary executable. That change to `next.config.js` allows the server to load zeromq (which is used by zerorpc) but it doesn't seem to be sufficient to allow the client to load it. Any reference to zerorpc on the client causes the client code to fail silently (see the `TODO DEBUG` comments in `pages/calculator/index.tsx`), which is blocking use of this sample app.


