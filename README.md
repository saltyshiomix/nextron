<p align="center"><img src="https://i.imgur.com/DNOsAH0.png"></p>

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

Build an [Electron](https://electronjs.org/) + [Next.js](https://nextjs.org/) app for speed ⚡

(The screenshot above is a top page of [examples/with-typescript-material-ui](./examples/with-typescript-material-ui).)

## Support

| nextron | next |
| --- | --- |
| `v4.x` | `v8.x` |
| `v2.x` / `v3.x` | `v7.x` |
| `v1.x` | `v6.x` |

## My Belief for Nextron

1. Show a way of developing desktop apps only web knowledge
1. Easy to use
1. Be transparent (Open to OSS developers)

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
```

### Create Application with Template

You can use `examples/*` apps as a template.

To create the `examples/with-typescript-material-ui` app, run the command below:

```bash
# with `nextron`
$ nextron init <MY-APP> --template with-typescript-material-ui

# with npx
$ npx create-nextron-app <MY-APP> --example with-typescript-material-ui

# with yarn
$ yarn create nextron-app <MY-APP> --example with-typescript-material-ui
```

### Run Electron with Development Mode

Run `npm run dev`, and nextron automatically launches an electron app.

```json
{
  "scripts": {
    "dev": "node build/nextron.js"
  }
}
```

### Production Build

Run `npm run build`, and nextron outputs packaged bundles under the `dist` folder.

```json
{
  "scripts": {
    "build": "node build/nextron.js build"
  }
}
```

### Build Options

To build Windows 32 bit version, run `npm run build:win32` like below:

```json
{
  "scripts": {
    "build": "node build/nextron.js build",
    "build:all": "node build/nextron.js build --all",
    "build:win32": "node build/nextron.js build --win --ia32",
    "build:win64": "node build/nextron.js build --win --x64",
    "build:mac": "node build/nextron.js build --mac --x64",
    "build:linux": "node build/nextron.js build --linux"
  }
}
```

**CAUTION**: To build macOS binary, your host machine must be macOS!

### Build Configuration

Edit `package.json#build` properties for custom build configuration.

```json
{
  "build": {
    "appId": "com.example.nextron",
    "productName": "My Nextron App",
    "copyright": "Copyright © 2018 Yoshihide Shiono",
    "directories": {
      "output": "dist",
      "buildResources": "resources"
    },
    "publish": null
  }
}
```

For more information, please check out [electron-builder official configuration documents](https://www.electron.build/configuration/configuration/).

## Examples

See [examples](./examples) folder for more information.

Or you can start the example app by `nextron init <app-name> --template <example-dirname>`.

To list all examples, just type the command below:

```bash
$ nextron list
```

### [examples/custom-build-options](./examples/custom-build-options)

```bash
# with `nextron`
$ nextron init my-app --template custom-build-options

# with npx
$ npx create-nextron-app my-app --example custom-build-options

# with yarn
$ yarn create nextron-app my-app --example custom-build-options
```

### [examples/custom-server](./examples/custom-server)

```bash
# with `nextron`
$ nextron init my-app --template custom-server

# with npx
$ npx create-nextron-app my-app --example custom-server

# with yarn
$ yarn create nextron-app my-app --example custom-server
```

### [examples/custom-server-nodemon](./examples/custom-server-nodemon)

```bash
# with `nextron`
$ nextron init my-app --template custom-server-nodemon

# with npx
$ npx create-nextron-app my-app --example custom-server-nodemon

# with yarn
$ yarn create nextron-app my-app --example custom-server-nodemon
```

### [examples/custom-server-typescript](./examples/custom-server-typescript)

```bash
# with `nextron`
$ nextron init my-app --template custom-server-typescript

# with npx
$ npx create-nextron-app my-app --example custom-server-typescript

# with yarn
$ yarn create nextron-app my-app --example custom-server-typescript
```

### [examples/ipc-communication](./examples/ipc-communication)

```bash
# with `nextron`
$ nextron init my-app --template ipc-communication

# with npx
$ npx create-nextron-app my-app --example ipc-communication

# with yarn
$ yarn create nextron-app my-app --example ipc-communication
```

<p align="center"><img src="https://i.imgur.com/pzWuuyi.png"></p>

### [examples/parameterized-routing](./examples/parameterized-routing)

```bash
# with `nextron`
$ nextron init my-app --template parameterized-routing

# with npx
$ npx create-nextron-app my-app --example parameterized-routing

# with yarn
$ yarn create nextron-app my-app --example parameterized-routing
```

<p align="center"><img src="https://i.imgur.com/LvPIeIj.png"></p>

### [examples/store-data](./examples/store-data)

```bash
# with `nextron`
$ nextron init my-app --template store-data

# with npx
$ npx create-nextron-app my-app --example store-data

# with yarn
$ yarn create nextron-app my-app --example store-data
```

<p align="center"><img src="https://i.imgur.com/2ELjNqK.png"></p>

### [examples/with-javascript](./examples/with-javascript)

```bash
# with `nextron`
$ nextron init my-app --template with-javascript

# with npx
$ npx create-nextron-app my-app --example with-javascript

# with yarn
$ yarn create nextron-app my-app --example with-javascript
```

<p align="center"><img src="https://i.imgur.com/ZWNgF2C.png"></p>

### [examples/with-javascript-ant-design](./examples/with-javascript-ant-design)

```bash
# with `nextron`
$ nextron init my-app --template with-javascript-ant-design

# with npx
$ npx create-nextron-app my-app --example with-javascript-ant-design

# with yarn
$ yarn create nextron-app my-app --example with-javascript-ant-design
```

<p align="center"><img src="https://i.imgur.com/PiEKeIZ.png"></p>

### [examples/with-javascript-material-ui](./examples/with-javascript-material-ui)

```bash
# with `nextron`
$ nextron init my-app --template with-javascript-material-ui

# with npx
$ npx create-nextron-app my-app --example with-javascript-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-javascript-material-ui
```

<p align="center"><img src="https://i.imgur.com/DNOsAH0.png"></p>

### [examples/with-typescript](./examples/with-typescript)

```bash
# with `nextron`
$ nextron init my-app --template with-typescript

# with npx
$ npx create-nextron-app my-app --example with-typescript

# with yarn
$ yarn create nextron-app my-app --example with-typescript
```

<p align="center"><img src="https://i.imgur.com/ZWNgF2C.png"></p>

### [examples/with-typescript-less](./examples/with-typescript-less)

```bash
# with `nextron`
$ nextron init my-app --template with-typescript-less

# with npx
$ npx create-nextron-app my-app --example with-typescript-less

# with yarn
$ yarn create nextron-app my-app --example with-typescript-less
```

<p align="center"><img src="https://i.imgur.com/cWBEdDR.png"></p>

### [examples/with-typescript-material-ui](./examples/with-typescript-material-ui)

```bash
# with `nextron`
$ nextron init my-app --template with-typescript-material-ui

# with npx
$ npx create-nextron-app my-app --example with-typescript-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-typescript-material-ui
```

<p align="center"><img src="https://i.imgur.com/DNOsAH0.png"></p>

## Develop

### Basic

```bash
$ git clone https://github.com/saltyshiomix/nextron
$ cd nextron
$ yarn
$ yarn dev # default is examples/with-javascript-material-ui
```

### Developing `examples/*`

```bash
$ yarn dev <EXAMPLE-FOLDER-NAME>
```

## Related

- [create-nextron-app - Create Nextron (Electron + Next.js) apps in one command ⚡](https://github.com/saltyshiomix/create-nextron-app)
- [Nuxtron - ⚡ Electron + Nuxt.js ⚡](https://github.com/saltyshiomix/nuxtron)
