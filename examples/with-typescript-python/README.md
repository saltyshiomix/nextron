# Electron + Next.js + Python Flask + GraphQL

This example builds a stand-alone Electron (Nextron) application into `./nextronpy-win32-x64/` (on windows, or into a similar folder OSX or Linux). You can change the name of the application by changing the "name" property in `package.json`.

# Installation

Tested with Python v3

NOTE: On windows you will need to [install anaconda](https://www.anaconda.com/download/) (which installs python and pip) and potentially configure environment variables to add python and/or pip to the path if you don't have it installed already.

**VERY IMPORTANT:** If you are on Windows and use VS Code or like Powershell, you need to type `cmd` inside the VS Code terminal or inside your Powershell window before running these commands because the conda environment switcher doesnt work under Powershell (much of it works, and the critical parts that don't work, like activating evironments, fail silently while appearing to work),

```bash
# start with the obvious step you always need to do with node projects
npm install

# Depending on the packages you install, with Electron projects you may need to do 
# an npm rebuild to rebuild any included binaries for the current OS. It's probably
# not needed here but I do it out of habit because its fast and the issues can be
# a pain to track down if they come up and you dont realize a rebuild is needed
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

**Please read:** This project requires Python, and the Python code requires a predictable set of libraries to be 
installed for Python, via the ```conda``` commands above. This means when you run npm commands like
`npm run dev` for this project, you need to be in a conda-activated terminal window (one where you have run `conda activate nextron-python-sample`). On Windows, that means you **cannot be in a powershell window** because conda doesn't work with powershell. If you use VS Code on windows, you need to manually type `cmd` in your integrated
terminal editor to turn the default powershell editor into an old-school command window. Then do `conda activate nextron-python-sample` in the new cmd prompt and you're all set to run your favorite npm commands as described below.

```bash
# please read the notes above about running conda activate and about running under VS Code on Windows

# run the unpackaged python scripts from a dev build of electron
npm run dev # note the first time you run this you may need to use the electron menu to refresh the window

# use pyinstaller to convert the source code in python/ into an executable in pythondist/
npm run build-python

# build the production electron application
npm run build-nextron

# package the Electron application (including the Python executable) into a single file
npm run package
```

# Debugging

To test the python GraphQL server, in a conda environment'ed terminal window run either `npm run dev-python` or `npm run dev` and then browse to `http://127.0.0.1:5000/graphql/` to access a GraphiQL viewer of the GraphQL server.

# Notes

The electron main process spawns the Python child process and creates the window. The electron renderer process and python backend communicate with each other using GraphQL web service calls.

The Python script `python/calc.py` provides a function: `calc(text)` that can take text like `1 + 1 / 2` and returns the result like `1.5`.

Launching the Python code in electron is tricky because of the different locations of the Python executable. The python executable is managed by `main/addPython.ts`. Before the Python code is packaged, it will `spawn` the Python script. After it is packaged it will `execFile` the generated executable.

Electron doesn't seem to provide functions to check whether the app is under distributed or not so `addPython.ts` checks whether the `*dist` folder has been generated or not. If generated, it means we are in "production" mode and should `execFile` the executable directly; otherwise it will `spawn` the script using a Python shell. This is a pretty brittle way to check for packaging, and requires that the npm commands used to run the app always delete the dist folder before starting to run.
