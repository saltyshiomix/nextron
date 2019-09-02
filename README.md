<p align="center"><img src="https://i.imgur.com/0vkxIMN.png"></p>
<p align="center">
  <a href="https://github.com/unicodeveloper/awesome-nextjs">
    <img src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/nextron">
    <img src="https://img.shields.io/npm/v/nextron.svg">
  </a>
  <a href="https://www.npmjs.com/package/nextron">
    <img src="https://img.shields.io/npm/dt/nextron.svg">
  </a>
</p>

Build an [Electron](https://electronjs.org) + [Next.js](https://nextjs.org) app for speed ⚡

(The screenshot above is a top page of [examples/with-javascript-material-ui](./examples/with-javascript-material-ui).)

## Support

### Nextron vs Next.js

| nextron | next |
| --- | --- |
| `v5.x` | `v9.x` |
| `v4.x` | `v8.x` |
| `v2.x` / `v3.x` | `v7.x` |
| `v1.x` | `v6.x` |

```
👍 JavaScript frontend/backend
👍 TypeScript frontend/backend
👍 TypeScript frontend/Python backend
```

### Package Manager

`npm`, `yarn` and `pnpm` are supported.

## My Belief for Nextron

1. Show a way of developing desktop apps only web knowledge
1. Easy to use
1. Be transparent and open to OSS developers

## Otherwise Specified

- If you need **more** performance with Electron, you should see these boilerplates
  - [szwacz/electron-boilerplate](https://github.com/szwacz/electron-boilerplate)
  - [chentsulin/electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
- If you want to use Nextron as production, please take responsibility for your actions
- But, if you have any troubles, questions or ideas, I'll support you, I promise

## Usage

### Install

```bash
$ npm install --global nextron@latest
```

### Create Application

To create `<MY-APP>`, just run the command below:

```bash
$ nextron init <MY-APP>
```

Or, you can use a `create-nextron-app` command without installing the `nextron` command globally:

```bash
# with npx
$ npx create-nextron-app <MY-APP>

# with yarn
$ yarn create nextron-app <MY-APP>

# with pnpx
$ pnpx create-nextron-app <MY-APP>
```

### Create Application with Template

You can use `examples/*` apps as a template.

To create the `examples/with-typescript-material-ui` app, run the command below:

```bash
# with `nextron`
$ nextron init <MY-APP> --example with-typescript-material-ui

# with npx
$ npx create-nextron-app <MY-APP> --example with-typescript-material-ui

# with yarn
$ yarn create nextron-app <MY-APP> --example with-typescript-material-ui

# with pnpx
$ pnpx create-nextron-app <MY-APP> --example with-typescript-material-ui
```

### Install Dependencies

Please use `npm install` or `yarn`, not `pnpm install`.

Electron can't handle `pnpm`'s structures of node_modules.

### Run Electron with Development Mode

Run `npm run dev`, and nextron automatically launches an electron app.

```json
{
  "scripts": {
    "dev": "nextron"
  }
}
```

### Production Build

Run `npm run build`, and nextron outputs packaged bundles under the `dist` folder.

```json
{
  "scripts": {
    "build": "nextron build"
  }
}
```

### Build Options

To build Windows 32 bit version, run `npm run build:win32` like below:

```json
{
  "scripts": {
    "build": "nextron build",
    "build:all": "nextron build --all",
    "build:win32": "nextron build --win --ia32",
    "build:win64": "nextron build --win --x64",
    "build:mac": "nextron build --mac --x64",
    "build:linux": "nextron build --linux"
  }
}
```

**CAUTION**: To build macOS binary, your host machine must be macOS!

### Build Configuration

Edit `electron-builder.yml` properties for custom build configuration.

```yml
appId: com.example.nextron
productName: My Nextron App
copyright: Copyright © 2018 Yoshihide Shiono
directories:
  output: dist
  buildResources: resources
files:
  - from: .
    filter:
      - package.json
      - app
publish: null
```

For more information, please check out [electron-builder official configuration documents](https://www.electron.build/configuration/configuration).

## nextron.config.js

```js
module.exports = {
  // main process' webpack config
  webpack: (defaultConfig, env) => {
    // do some stuff here
    return defaultConfig;
  },
};
```

### Additional Entries

```js
module.exports = {
  webpack: (defaultConfig, env) => Object.assign(defaultConfig, {
    entry: {
      // electron main process
      background: './main/background.js',
      // we can require `config.js` by using `require('electron').remote.require('./config')`
      config: './main/config.js',
    },
  }),
};
```

## Tips

### Next.js' Webpack Processes

There are two webpack processes: a server process and client one.

If we want to use some libraries that don't support SSR(Server Side Rendering), we should check if the current process is whether a server or client:

```jsx
// pages/home.jsx

import electron from 'electron';

const Home = () => {
  // we can't use `electron.remote` directly!
  const remote = electron.remote;

  // we should check it like this
  const remote = electron.remote || false;
  if (remote) {
    // we can use `electron.remote`
    // because this scope is the client webpack process
  }
};

export default Home;
```

### The Basic of React Hooks :)

As mentioned above, we should check if the webpack process is a client because the renderer process is a web client.

So we must use react `state` as follows:

```jsx
// pages/home.jsx

import electron from 'electron';
import React, { useState, useEffect } from 'react';

// prevent SSR webpacking
const remote = electron.remote || false;

const Home = () => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    // componentDidMount()
    if (remote) {
      // require `./main/config.js` from `./main/background.js`
      // and set the config
      setConfig(remote.require('./config').default);
    }

    return () => {
      // componentWillUnmount()
    };
  }, []);

  return (
    <React.Fragment>
      <p>Message: {config.message}</p>
    </React.Fragment>
  );
};

export default Home;
```

## Examples

See [examples](./examples) folder for more information.

Or we can start the example app by `nextron init <app-name> --example <example-dirname>`.

To list all examples, just type the command below:

```bash
$ nextron list
```

### [examples/api-routes](./examples/api-routes)

<p align="center"><img src="https://i.imgur.com/TXLXR6J.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example api-routes

# with npx
$ npx create-nextron-app my-app --example api-routes

# with yarn
$ yarn create nextron-app my-app --example api-routes

# with pnpx
$ pnpx create-nextron-app my-app --example api-routes
```

### [examples/custom-build-options](./examples/custom-build-options)

<p align="center"><img src="https://i.imgur.com/QqQekRJ.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example custom-build-options

# with npx
$ npx create-nextron-app my-app --example custom-build-options

# with yarn
$ yarn create nextron-app my-app --example custom-build-options

# with pnpx
$ pnpx create-nextron-app my-app --example custom-build-options
```

### [examples/custom-main-entry](./examples/custom-main-entry)

<p align="center"><img src="https://i.imgur.com/nqpLJI0.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example custom-main-entry

# with npx
$ npx create-nextron-app my-app --example custom-main-entry

# with yarn
$ yarn create nextron-app my-app --example custom-main-entry

# with pnpx
$ pnpx create-nextron-app my-app --example custom-main-entry
```

### [examples/custom-server](./examples/custom-server)

<p align="center"><img src="https://i.imgur.com/SBTLNhq.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example custom-server

# with npx
$ npx create-nextron-app my-app --example custom-server

# with yarn
$ yarn create nextron-app my-app --example custom-server

# with pnpx
$ pnpx create-nextron-app my-app --example custom-server
```

### [examples/custom-server-nodemon](./examples/custom-server-nodemon)

<p align="center"><img src="https://i.imgur.com/yTvam6R.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example custom-server-nodemon

# with npx
$ npx create-nextron-app my-app --example custom-server-nodemon

# with yarn
$ yarn create nextron-app my-app --example custom-server-nodemon

# with pnpx
$ pnpx create-nextron-app my-app --example custom-server-nodemon
```

### [examples/custom-server-typescript](./examples/custom-server-typescript)

<p align="center"><img src="https://i.imgur.com/fyjMMmP.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example custom-server-typescript

# with npx
$ npx create-nextron-app my-app --example custom-server-typescript

# with yarn
$ yarn create nextron-app my-app --example custom-server-typescript

# with pnpx
$ pnpx create-nextron-app my-app --example custom-server-typescript
```

### [examples/ipc-communication](./examples/ipc-communication)

<p align="center"><img src="https://i.imgur.com/kIDlAFT.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example ipc-communication

# with npx
$ npx create-nextron-app my-app --example ipc-communication

# with yarn
$ yarn create nextron-app my-app --example ipc-communication

# with pnpx
$ pnpx create-nextron-app my-app --example ipc-communication
```

### [examples/parameterized-routing](./examples/parameterized-routing)

<p align="center"><img src="https://i.imgur.com/ICrzX0V.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example parameterized-routing

# with npx
$ npx create-nextron-app my-app --example parameterized-routing

# with yarn
$ yarn create nextron-app my-app --example parameterized-routing

# with pnpx
$ pnpx create-nextron-app my-app --example parameterized-routing
```

### [examples/remote-require](./examples/remote-require)

<p align="center"><img src="https://i.imgur.com/9fdMREj.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example remote-require

# with npx
$ npx create-nextron-app my-app --example remote-require

# with yarn
$ yarn create nextron-app my-app --example remote-require

# with pnpx
$ pnpx create-nextron-app my-app --example remote-require
```

### [examples/store-data](./examples/store-data)

<p align="center"><img src="https://i.imgur.com/BgFze6G.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example store-data

# with npx
$ npx create-nextron-app my-app --example store-data

# with yarn
$ yarn create nextron-app my-app --example store-data

# with pnpx
$ pnpx create-nextron-app my-app --example store-data
```

### [examples/web-worker](./examples/web-worker)

<p align="center"><img src="https://i.imgur.com/mq6qMPk.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example web-worker

# with npx
$ npx create-nextron-app my-app --example web-worker

# with yarn
$ yarn create nextron-app my-app --example web-worker

# with pnpx
$ pnpx create-nextron-app my-app --example web-worker
```

### [examples/with-javascript](./examples/with-javascript)

<p align="center"><img src="https://i.imgur.com/X7dSE68.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-javascript

# with npx
$ npx create-nextron-app my-app --example with-javascript

# with yarn
$ yarn create nextron-app my-app --example with-javascript

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript
```

### [examples/with-javascript-ant-design](./examples/with-javascript-ant-design)

<p align="center"><img src="https://i.imgur.com/NrkTPe9.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-javascript-ant-design

# with npx
$ npx create-nextron-app my-app --example with-javascript-ant-design

# with yarn
$ yarn create nextron-app my-app --example with-javascript-ant-design

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript-ant-design
```

### [examples/with-javascript-emotion](./examples/with-javascript-emotion)

<p align="center"><img src="https://i.imgur.com/FDRVPr8.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-javascript-emotion

# with npx
$ npx create-nextron-app my-app --example with-javascript-emotion

# with yarn
$ yarn create nextron-app my-app --example with-javascript-emotion

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript-emotion
```

### [examples/with-javascript-material-ui](./examples/with-javascript-material-ui)

<p align="center"><img src="https://i.imgur.com/0vkxIMN.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-javascript-material-ui

# with npx
$ npx create-nextron-app my-app --example with-javascript-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-javascript-material-ui

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript-material-ui
```

### [examples/with-python](./examples/with-python)

<p align="center"><img src="https://i.imgur.com/1hAUjRY.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-python

# with npx
$ npx create-nextron-app my-app --example with-python

# with yarn
$ yarn create nextron-app my-app --example with-python

# with pnpx
$ pnpx create-nextron-app my-app --example with-python
```

### [examples/with-typescript](./examples/with-typescript)

<p align="center"><img src="https://i.imgur.com/NZfsD1p.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-typescript

# with npx
$ npx create-nextron-app my-app --example with-typescript

# with yarn
$ yarn create nextron-app my-app --example with-typescript

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript
```

### [examples/with-typescript-emotion](./examples/with-typescript-emotion)

<p align="center"><img src="https://i.imgur.com/3UKgyH7.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-typescript-emotion

# with npx
$ npx create-nextron-app my-app --example with-typescript-emotion

# with yarn
$ yarn create nextron-app my-app --example with-typescript-emotion

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-emotion
```

### [examples/with-typescript-less](./examples/with-typescript-less)

<p align="center"><img src="https://i.imgur.com/OBtezMb.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-typescript-less

# with npx
$ npx create-nextron-app my-app --example with-typescript-less

# with yarn
$ yarn create nextron-app my-app --example with-typescript-less

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-less
```

### [examples/with-typescript-material-ui](./examples/with-typescript-material-ui)

<p align="center"><img src="https://i.imgur.com/flcMvDC.png"></p>

```bash
# with `nextron`
$ nextron init my-app --example with-typescript-material-ui

# with npx
$ npx create-nextron-app my-app --example with-typescript-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-typescript-material-ui

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-material-ui
```

### [examples/with-typescript-python-api](./examples/with-typescript-python-api)

<p align="center"><img src="https://i.imgur.com/NvpeT9C.png"></p>

(Note: When working with the with-typescript-python-api example, see the example's readme file for python setup details)

```bash
# with `nextron`
$ nextron init my-app --example with-typescript-python-api

# with npx
$ npx create-nextron-app my-app --example with-typescript-python-api

# with yarn
$ yarn create nextron-app my-app --example with-typescript-python-api

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-python-api
```

## Develop

### Basic

```bash
$ git clone https://github.com/saltyshiomix/nextron.git
$ cd nextron
$ yarn
$ yarn dev # default is examples/with-javascript
```

`pnpm` or `npm` are also supported.

### Developing `examples/*`

```bash
$ yarn dev <EXAMPLE-FOLDER-NAME>
```

## Related

- [create-nextron-app](https://github.com/saltyshiomix/create-nextron-app) - Create Nextron (Electron + Next.js) apps in one command ⚡
- [Nuxtron](https://github.com/saltyshiomix/nuxtron) - ⚡ Electron + Nuxt.js ⚡

## License

This project is licensed under the terms of the [MIT license](https://github.com/saltyshiomix/nextron/blob/master/LICENSE).
