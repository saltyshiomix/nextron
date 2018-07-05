[![npm](https://img.shields.io/npm/v/nextron.svg)](https://www.npmjs.com/package/nextron)
[![downloads](https://img.shields.io/npm/dt/nextron.svg)](https://www.npmjs.com/package/nextron)

Build an [Electron](https://electronjs.org/) + [Next.js](https://nextjs.org/) app for speed ⚡

- electron@^2.0.4
- next@6.1.1

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

You can use `examples/*` sample apps as templating.

To create the `example/with-typescript` app, run the command below:

```bash
$ nextron init <MY-APP> --template with-typescript
```

### Run Electron with Development Mode

Run `npm run dev`, and nextron automatically launches the electron app.

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

### Build Configuration

Edit `package.json#build` properties for custom configuration.

For more information, please see [electron-builder configuration documents](https://github.com/electron-userland/electron-builder/blob/master/docs/configuration/configuration.md).

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
