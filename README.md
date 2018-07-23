<p align="center"><img src="https://i.imgur.com/DNOsAH0.png"></p>

<p align="center">
  <a href="https://www.npmjs.com/package/nextron"><img src="https://img.shields.io/npm/v/nextron.svg"></a>
  <a href="https://www.npmjs.com/package/nextron"><img src="https://img.shields.io/npm/dt/nextron.svg"></a>
</p>

Build an [Electron](https://electronjs.org/) + [Next.js](https://nextjs.org/) app for speed ⚡

(The screenshot above is a top page of [examples/with-typescript-material-ui](./examples/with-typescript-material-ui).)

## My Belief for Nextron

1. Show a way of developing desktop apps only web knowledge
1. Easy to use
1. Open to OSS developers

## Otherwise Specified

- If you need performance with Electron, you should see these boilerplates
  - [szwacz/electron-boilerplate](https://github.com/szwacz/electron-boilerplate)
  - [chentsulin/electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
- If you want to use Nextron as production, please take responsibility for your actions
- But, if you have any troubles, questions or ideas, I'll support you, I promise

## Usage

### Install

```bash
$ npm install --global nextron
```

### Create Application

To create `<MY-APP>`, just run the command below:

```bash
$ nextron init <MY-APP>
```

### Create Application with Template

You can use `examples/*` apps as a template.

To create the `examples/with-typescript-material-ui` app, run the command below:

```bash
$ nextron init <MY-APP> --template with-typescript-material-ui
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

Edit `package.json#build` properties for custom build configuration.

```json
{
  "build": {
    "appId": "com.example.nextron",
    "productName": "My Nextron App",
    "copyright": "Copyright © ${year} ${author}",
    "files": [
      "app/**/*",
      "node_modules/**/*",
      "package.json"
    ],
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

## Develop

### Basic

```bash
$ git clone https://github.com/saltyshiomix/nextron
$ cd nextron
$ yarn
$ yarn dev # default is examples/with-javascript
```

### Developing `examples/*`

```bash
$ yarn dev <EXAMPLE-FOLDER-NAME>
```
