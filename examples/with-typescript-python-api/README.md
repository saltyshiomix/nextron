<p align="center"><img src="https://i.imgur.com/NvpeT9C.png"></p>

# Electron + Next.js + Python Flask + GraphQL

This example builds a stand-alone Electron + Next + Python application and installer. On Windows it builds the app into `./dist/win-uppacked/My Nextron Python App.exe` and the installer into `./dist/My Nextron Python App Setup 1.0.0.exe` (OSX and Linux destinations are similar). You can change the name of the application by changing the `name` property in `package.json`.

# Create an App

```zsh
# with `nextron`
$ nextron init my-app --example with-typescript-python-api

# with npx
$ npx create-nextron-app my-app --example with-typescript-python-api

# with yarn
$ yarn create nextron-app my-app --example with-typescript-python-api

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-python-api
```

# Installation

Tested with Anaconda Python v3, should work fine with Anaconda Python v2.

NOTE: On windows you will need to [install anaconda](https://www.anaconda.com/download/) (which installs python and pip) and potentially configure environment variables to add python and/or pip to the path if you don't have it installed already.

```zsh
# start with the obvious step you always need to do with node projects
npm install

# Depending on the packages you install, with Electron projects you may need to do 
# an npm rebuild to rebuild any included binaries for the current OS. It's probably
# not needed here but I do it out of habit because its fast and the issues can be
# a pain to track down if they come up and you dont realize a rebuild is needed
npm rebuild
```

**VERY IMPORTANT:** Windows users, if you use VS Code or use Powershell as your shell, you need to type `cmd` inside the VS Code terminal or inside your Powershell window before running the conda commands because conda's environment switcher will not work under Powershell (much of it works, but the critical parts that don't work, like activating evironments, fail silently while appearing to work),

```zsh
# install Anaconda if not already installed

cmd # Only needed if you're coding on Windows in VS Code or Powershell, as discussed above
conda env create -f environment.yml
conda activate nextron-python-sample
conda env list # make sure the nextron-python-sample has a * in front indicating it is activated (under Powershell on Windows the activate command fails silently which is why you needed to run the conda commands in a cmd prompt)

# run the unpackaged python scripts from a dev build of electron
npm run dev # must be run in the same shell you just conda activated
```

**NOTE** if you see the following error message when trying to `npm run dev` it means you did not successfully `conda activate nextron-python-sample` in the shell from which you are trying to `npm run dev`. On Windows under VS Code that could be because you forgot to go into a `cmd` shell as discussed above before trying to conda activate.

```
Traceback (most recent call last):
  File "python/api.py", line 3, in <module>
    from graphene import ObjectType, String, Schema
ModuleNotFoundError: No module named 'graphene'
```

```zsh
# use pyinstaller to convert the source code in python/ into an executable in pythondist/, build the electron app, and run electron-packager to package the electron app as a single file
npm run build # must be run in the same shell you just conda activated

# double-click to run the either the platform-specific app that is built into a subdirectory of dist or the platform-specific installer that is built and placed in the dist folder
```

# Debugging Python GraphQL server

To test the python GraphQL server, in a conda activated terminal window run `npm run build-python`, cd into the newly generated `pythondist` folder, and run `api.exe` then browse to http://127.0.0.1:5000/graphql/ to access a GraphiQL viewer of the GraphQL server. For a more detailed example, try `http://127.0.0.1:5000/graphql/?query={calc(math:"1/2")}` which works great if you copy and paste into the browser but which is a complex enough URL that it will confuse chrome if you try to click directly on it.

# Notes

The electron main process both spawns the Python child process and creates the window. The electron renderer process communicates with the python backend via GraphQL web service calls.

The Python script `python/calc.py` provides a function: `calc(text)` that can take text like `1 + 1` and return the result like `2.0`. The calc functionality is exposed as a GraphQL api by `python/api.py`.

The details of how the electron app launches the Python executable is tricky because of differences between packaged and unpackaged scenarios. This complexity is handled by `main/background-with-python-api.ts`. If the Electron app is not packaged, the code needs to `spawn` the Python source script. If the Electron app is packaged, it needs to `execFile` the packaged Python executable found in the app.asar. To decide whether the Electron app itself has been packaged for distribution or not, `main/background-with-python-api.ts` checks whether the `__dirname` looks like an asar folder or not. Killing spawned processes under Electron can also be tricky so the electron main process sends a message to the Python server telling it to exit when Electron is shutting down.
