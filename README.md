<p align="center"><img src="https://i.imgur.com/0vkxIMN.png"></p>
<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/nextron">
    <img src="https://img.shields.io/npm/v/nextron.svg?style=for-the-badge&labelColor=000000" alt="NPM version">
  </a>
  <a aria-label="NPM downloads" href="https://www.npmjs.com/package/nextron">
    <img src="https://img.shields.io/npm/dt/nextron.svg?style=for-the-badge&labelColor=000000" alt="NPM downloads">
  </a>
  <img src="https://img.shields.io/github/license/saltyshiomix/nextron.svg?style=for-the-badge&labelColor=000000" alt="Package License (MIT)">
  <a aria-label="AWESOME NEXTJS" href="https://github.com/unicodeveloper/awesome-nextjs">
    <img src="https://img.shields.io/badge/AWESOME%20%20NEXTJS-b37fb3.svg?style=for-the-badge" alt="AWESOME NEXTJS">
  </a>
</p>

## Support

### Nextron vs Next.js

| nextron | next |
| --- | --- |
| `v6.x` | `v10.x` |
| `v5.x` | `v9.x` |
| `v4.x` | `v8.x` |
| `v2.x` / `v3.x` | `v7.x` |
| `v1.x` | `v6.x` |

### Package Manager

`npm`, `yarn` and `pnpm >= v4` are supported.

## My Belief for Nextron

1. Show a way of developing desktop apps only web knowledge
1. Easy to use
1. Be transparent and open to OSS developers

## Usage

### Create Application with Template

We can use `examples/*` as a template.

To create the `examples/with-typescript-material-ui`, run the command below:

```
# with npm
$ npm init nextron-app MY_APP --example with-typescript-material-ui

# with yarn
$ yarn create nextron-app MY_APP --example with-typescript-material-ui

# with pnpx
$ pnpx create-nextron-app MY_APP --example with-typescript-material-ui
```

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
copyright: Copyright © 2020 Yoshihide Shiono
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
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: 'main',
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: 'renderer',

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

## Custom Babel Config

We can extends the default babel config of main process by putting `.babelrc` in our project root like this:

**`.babelrc`**:

```json
{
  "presets": [
    "nextron/babel"
  ]
}
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

### [examples/custom-build-options](./examples/custom-build-options)

<p align="center"><img src="https://i.imgur.com/QqQekRJ.png"></p>

```
# with npm
$ npm init nextron-app my-app --example custom-build-options

# with yarn
$ yarn create nextron-app my-app --example custom-build-options

# with pnpx
$ pnpx create-nextron-app my-app --example custom-build-options
```

### [examples/custom-main-entry](./examples/custom-main-entry)

<p align="center"><img src="https://i.imgur.com/nqpLJI0.png"></p>

```
# with npm
$ npm init nextron-app my-app --example custom-main-entry

# with yarn
$ yarn create nextron-app my-app --example custom-main-entry

# with pnpx
$ pnpx create-nextron-app my-app --example custom-main-entry
```

### [examples/custom-renderer-port](./examples/custom-renderer-port)

<p align="center"><img src="https://i.imgur.com/X7dSE68.png"></p>

```
# with npm
$ npm init nextron-app my-app --example custom-renderer-port

# with yarn
$ yarn create nextron-app my-app --example custom-renderer-port

# with pnpx
$ pnpx create-nextron-app my-app --example custom-renderer-port
```

### [examples/ipc-communication](./examples/ipc-communication)

<p align="center"><img src="https://i.imgur.com/kIDlAFT.png"></p>

```
# with npm
$ npm init nextron-app my-app --example ipc-communication

# with yarn
$ yarn create nextron-app my-app --example ipc-communication

# with pnpx
$ pnpx create-nextron-app my-app --example ipc-communication
```

### [examples/parameterized-routing](./examples/parameterized-routing)

<p align="center"><img src="https://i.imgur.com/ICrzX0V.png"></p>

```
# with npm
$ npm init nextron-app my-app --example parameterized-routing

# with yarn
$ yarn create nextron-app my-app --example parameterized-routing

# with pnpx
$ pnpx create-nextron-app my-app --example parameterized-routing
```

### [examples/remote-require](./examples/remote-require)

<p align="center"><img src="https://i.imgur.com/9fdMREj.png"></p>

```
# with npm
$ npm init nextron-app my-app --example remote-require

# with yarn
$ yarn create nextron-app my-app --example remote-require

# with pnpx
$ pnpx create-nextron-app my-app --example remote-require
```

### [examples/store-data](./examples/store-data)

<p align="center"><img src="https://i.imgur.com/BgFze6G.png"></p>

```
# with npm
$ npm init nextron-app my-app --example store-data

# with yarn
$ yarn create nextron-app my-app --example store-data

# with pnpx
$ pnpx create-nextron-app my-app --example store-data
```

### [examples/web-worker](./examples/web-worker)

<p align="center"><img src="https://i.imgur.com/mq6qMPk.png"></p>

```
# with npm
$ npm init nextron-app my-app --example web-worker

# with yarn
$ yarn create nextron-app my-app --example web-worker

# with pnpx
$ pnpx create-nextron-app my-app --example web-worker
```

### [examples/with-javascript](./examples/with-javascript)

<p align="center"><img src="https://i.imgur.com/X7dSE68.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-javascript

# with yarn
$ yarn create nextron-app my-app --example with-javascript

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript
```

### [examples/with-javascript-ant-design](./examples/with-javascript-ant-design)

<p align="center"><img src="https://i.imgur.com/NrkTPe9.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-javascript-ant-design

# with yarn
$ yarn create nextron-app my-app --example with-javascript-ant-design

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript-ant-design
```

### [examples/with-javascript-emotion](./examples/with-javascript-emotion)

<p align="center"><img src="https://i.imgur.com/FDRVPr8.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-javascript-emotion

# with yarn
$ yarn create nextron-app my-app --example with-javascript-emotion

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript-emotion
```

### [examples/with-javascript-material-ui](./examples/with-javascript-material-ui)

<p align="center"><img src="https://i.imgur.com/0vkxIMN.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-javascript-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-javascript-material-ui

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript-material-ui
```

### [examples/with-javascript-tailwindcss](./examples/with-javascript-tailwindcss)

<p align="center"><img src="https://i.imgur.com/P08L8HO.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-javascript-tailwindcss

# with yarn
$ yarn create nextron-app my-app --example with-javascript-tailwindcss

# with pnpx
$ pnpx create-nextron-app my-app --example with-javascript-tailwindcss
```

### [examples/with-typescript](./examples/with-typescript)

<p align="center"><img src="https://i.imgur.com/NZfsD1p.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-typescript

# with yarn
$ yarn create nextron-app my-app --example with-typescript

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript
```

### [examples/with-typescript-emotion](./examples/with-typescript-emotion)

<p align="center"><img src="https://i.imgur.com/3UKgyH7.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-typescript-emotion

# with yarn
$ yarn create nextron-app my-app --example with-typescript-emotion

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-emotion
```

### [examples/with-typescript-material-ui](./examples/with-typescript-material-ui)

<p align="center"><img src="https://i.imgur.com/flcMvDC.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-typescript-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-typescript-material-ui

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-material-ui
```

### [examples/with-typescript-tailwindcss](./examples/with-typescript-tailwindcss)

<p align="center"><img src="https://i.imgur.com/a9QWW0v.png"></p>

```
# with npm
$ npm init nextron-app my-app --example with-typescript-tailwindcss

# with yarn
$ yarn create nextron-app my-app --example with-typescript-tailwindcss

# with pnpx
$ pnpx create-nextron-app my-app --example with-typescript-tailwindcss
```

## Develop

### Basic

```
$ git clone https://github.com/saltyshiomix/nextron.git
$ cd nextron
$ yarn
$ yarn dev # default is examples/with-javascript
```

`pnpm` or `npm` are also supported.

### Developing `examples/*`

```
$ yarn dev <EXAMPLE-FOLDER-NAME>
```

## Related

- [create-nextron-app](https://github.com/saltyshiomix/create-nextron-app) - Create Nextron (Electron + Next.js) apps in one command ⚡
- [Nuxtron](https://github.com/saltyshiomix/nuxtron) - ⚡ Electron + Nuxt.js ⚡

## License

This project is licensed under the terms of the [MIT license](https://github.com/saltyshiomix/nextron/blob/master/LICENSE).
