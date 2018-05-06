[![npm](https://img.shields.io/npm/v/nextron.svg)](https://www.npmjs.com/package/nextron)
[![downloads](https://img.shields.io/npm/dt/nextron.svg)](https://www.npmjs.com/package/nextron)

Build the [Electron](https://electronjs.org/) + [Next.js](https://nextjs.org/) app for speed ⚡

## Requirements

- `"node": ">=8.2.0"`
- `"npm": ">=5.2.0"`

## Install

```bash
$ npm install --global nextron
```

## Usage

```bash
$ nextron init <YOUR-APP-NAME>
$ cd <YOUR-APP-NAME>
$ yarn dev # for development
$ yarn build # for packaging the electron app
```

## Usage for TypeScript

```bash
$ nextron-ts init <YOUR-APP-NAME>
$ cd <YOUR-APP-NAME>
$ yarn dev # for development
$ yarn build # for packaging the electron app
```

## Build Configuration

Edit `package.json#build` properties for custom configuration.

For more information, please see [electron-builder configuration documents](https://github.com/electron-userland/electron-builder/blob/master/docs/configuration/configuration.md).
