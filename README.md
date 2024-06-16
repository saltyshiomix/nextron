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

<h2 align="center">
  <a aria-label="2024 Roadmaps - I'm back!" href="https://github.com/saltyshiomix/nextron/issues/442">
    2024 Roadmaps - I'm back!
  </a>
</h2>

## Support

### Next.js vs Nextron

| next              | nextron         |
| ----------------- | --------------- |
| `v14.x`           | `v9.x`          |
| `v12.x` / `v13.x` | `v8.x`          |
| `v11.x`           | `v7.x`          |
| `v10.x`           | `v6.x`          |
| `v9.x`            | `v5.x`          |
| `v8.x`            | `v4.x`          |
| `v7.x`            | `v2.x` / `v3.x` |
| `v6.x`            | `v1.x`          |

### Package Manager

`npm`, `yarn` and `pnpm` are supported.

## My Belief for Nextron

1. Show a way of developing desktop apps with only web knowledge
1. Easy to use
1. Be transparent and open to OSS developers

## Usage

### Create Application with Template

We can use `examples/*` as a template.

To create the `examples/with-tailwindcss`, run the command below:

```
# with npx
$ npx create-nextron-app MY_APP --example with-tailwindcss

# with yarn
$ yarn create nextron-app MY_APP --example with-tailwindcss

# with pnpm
$ pnpm dlx create-nextron-app MY_APP --example with-tailwindcss
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

## Basic Directory Structures

```
.
├── main
│   ├── background.ts
│   └── preload.ts
├── renderer
│   ├── next.config.js
│   ├── pages
│   │   ├── home.tsx
│   │   └── next.tsx
│   ├── preload.d.ts
│   ├── public
│   │   └── images
│   │       └── logo.png
│   └── tsconfig.json
├── resources
│   ├── icon.icns
│   └── icon.ico
├── nextron.config.js
├── electron-builder.yml
├── package.json
├── tsconfig.json
└── README.md
```

## `next.config.js`

```js
// in `./renderer/next.config.js`
module.exports = {
  // we need to export static files so as Electron can handle them
  output: 'export',

  distDir:
    process.env.NODE_ENV === 'production'
      ? // we want to change `distDir` to "../app" so as nextron can build the app in production mode!
        '../app'
      : // default `distDir` value
        '.next',

  // e.g. home.html => home/index.html
  trailingSlash: true,

  // we need to disable image optimization, because it is not compatible with `{ output: 'export' }`
  images: {
    unoptimized: true,
  },

  // webpack config for next.js
  webpack: (config) => {
    return config
  },
}
```

## `nextron` or `nextron dev` Options

### `--renderer-port` (default: `8888`)

It specifies `next` dev server port:

```json
{
  "scripts": {
    "dev": "nextron --renderer-port 7777"
  }
}
```

### `--run-only` (default: `undefined`)

It suppresses hot reloading of the main process:

```json
{
  "scripts": {
    "dev": "nextron --run-only"
  }
}
```

### `--startup-delay` (default: `0`)

It waits until renderer process is ready (milliseconds):

```json
{
  "scripts": {
    "dev": "nextron --startup-delay 3000"
  }
}
```

### `--electron-options` (default: `undefined`)

We can pass electron args via `--electron-options`:

```json
{
  "scripts": {
    "dev": "nextron --electron-options=\"--no-sandbox\""
  }
}
```

## `nextron build` Options

**NOTE**:

- To build macOS binary, your host machine must be macOS!
- Please consider to use `electron-builder.yml` instead of these CLI options.
  - [Command Line Interface (CLI) - electron-builder](https://www.electron.build/cli)
  - [Common Configuration - electron-builder](https://www.electron.build/configuration/configuration)

To build Windows 32 bit version, run `npm run build:win32` like below:

```json
{
  "scripts": {
    "build": "nextron build",
    "build:mac": "nextron build --mac",
    "build:mac:universal": "nextron build --mac --universal",
    "build:linux": "nextron build --linux",
    "build:win32": "nextron build --win --ia32",
    "build:win64": "nextron build --win --x64"
  }
}
```

### `--config` (default: `./electron-builder.yml`)

```json
{
  "scripts": {
    "build": "nextron build --config ./configs/electron-builder.prod.yml"
  }
}
```

### `--publish` (default: `undefined`)

**Note**

Highly recommend to use `electron-builder.yml`:

https://www.electron.build/configuration/publish

### `--no-pack` (default: `undefined`)

This option skips packaging by electron-builder:

```json
{
  "scripts": {
    "build": "nextron build --no-pack"
  }
}
```

### Build Configuration: `electron-builder.yml`

Edit `electron-builder.yml` for custom build configurations:

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
publish: null # see https://www.electron.build/configuration/publish
```

For more information, please check out [electron-builder official configuration documents](https://www.electron.build/configuration/configuration).

## Custom Config: `nextron.config.js`

```js
module.exports = {
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: 'main',
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: 'renderer',

  // main process' webpack config
  webpack: (config, env) => {
    // do some stuff here
    return config
  },
}
```

## Custom Babel Config for Main Process

We can extends the default babel config of main process by putting `.babelrc` in our project root like this:

**`.babelrc`**:

```json
{
  "presets": ["nextron/babel"]
}
```

## Examples

### [examples/basic-lang-javascript](./examples/basic-lang-javascript)

<p align="center"><img src="https://i.imgur.com/X7dSE68.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example basic-lang-javascript

# with yarn
$ yarn create nextron-app my-app --example basic-lang-javascript

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-lang-javascript
```

### [examples/basic-lang-javascript-python](./examples/basic-lang-javascript-python)

<p align="center"><img src="https://i.imgur.com/RzAykrU.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example basic-lang-javascript-python

# with yarn
$ yarn create nextron-app my-app --example basic-lang-javascript-python

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-lang-javascript-python
```

### [examples/basic-lang-typescript](./examples/basic-lang-typescript)

<p align="center"><img src="https://i.imgur.com/NZfsD1p.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example basic-lang-typescript

# with yarn
$ yarn create nextron-app my-app --example basic-lang-typescript

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-lang-typescript
```

### [examples/basic-launch-app-from-url](./examples/basic-launch-app-from-url)

This example shows how to open your app from browser URL.

Note: this example works **only production build**!

<p align="center"><img src="./docs/examples/basic-launch-app-from-url/nextron.gif"></p>

```
# with npx
$ npx create-nextron-app my-app --example basic-launch-app-from-url

# with yarn
$ yarn create nextron-app my-app --example basic-launch-app-from-url

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-launch-app-from-url

# --------------------------------------------------------------

# Production build
$ yarn build (or `npm run build` or `pnpm run build`)
```

After production build, open `your-custom-protocol://open?token=jwt-value` in your browser, then the app will be shown like a magic!

If you want to change schema URL, please edit `electron-builder.yml#protocols`:

```yml
protocols:
  name: Your App Name
  schemes: [your-custom-protocol-edited]
```

Then, you can see the app from URL: `your-custom-protocol-edited://any-uri-here?data=include-any-data`.

### [examples/basic-store-data](./examples/basic-store-data)

<p align="center"><img src="https://i.imgur.com/BgFze6G.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example basic-store-data

# with yarn
$ yarn create nextron-app my-app --example basic-store-data

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-store-data
```

### [examples/custom-build-options](./examples/custom-build-options)

<p align="center"><img src="https://i.imgur.com/QqQekRJ.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example custom-build-options

# with yarn
$ yarn create nextron-app my-app --example custom-build-options

# with pnpm
$ pnpm dlx create-nextron-app my-app --example custom-build-options
```

### [examples/custom-renderer-port](./examples/custom-renderer-port)

<p align="center"><img src="https://i.imgur.com/X7dSE68.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example custom-renderer-port

# with yarn
$ yarn create nextron-app my-app --example custom-renderer-port

# with pnpm
$ pnpm dlx create-nextron-app my-app --example custom-renderer-port
```

### [examples/with-ant-design](./examples/with-ant-design)

<p align="center"><img src="https://i.imgur.com/NrkTPe9.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example with-ant-design

# with yarn
$ yarn create nextron-app my-app --example with-ant-design

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-ant-design
```

### [examples/with-chakra-ui](./examples/with-chakra-ui)

<p align="center">
  <img src="https://i.imgur.com/oahHuxG.png">
  <img src="https://i.imgur.com/sZ01Nyl.png">
</p>

```
# with npx
$ npx create-nextron-app my-app --example with-chakra-ui

# with yarn
$ yarn create nextron-app my-app --example with-chakra-ui

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-chakra-ui
```

### [examples/with-emotion](./examples/with-emotion)

<p align="center"><img src="https://i.imgur.com/3UKgyH7.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example with-emotion

# with yarn
$ yarn create nextron-app my-app --example with-emotion

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-emotion
```

### [examples/with-material-ui](./examples/with-material-ui)

<p align="center"><img src="https://i.imgur.com/flcMvDC.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example with-material-ui

# with yarn
$ yarn create nextron-app my-app --example with-material-ui

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-material-ui
```

### [examples/with-next-i18next](./examples/with-next-i18next)

<p align="center"><img src="https://i.imgur.com/uhXCr6v.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example with-next-i18next

# with yarn
$ yarn create nextron-app my-app --example with-next-i18next

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-next-i18next
```

### [examples/with-tailwindcss](./examples/with-tailwindcss)

<p align="center"><img src="https://i.imgur.com/a9QWW0v.png"></p>

```
# with npx
$ npx create-nextron-app my-app --example with-tailwindcss

# with yarn
$ yarn create nextron-app my-app --example with-tailwindcss

# with pnpm
$ pnpm dlx create-nextron-app my-app --example with-tailwindcss
```

## Develop

### Basic

```
$ git clone https://github.com/saltyshiomix/nextron.git
$ cd nextron
$ pnpm install
$ pnpm dev # default is examples/basic-lang-javascript
```

### Developing `examples/*`

```
$ pnpm dev <EXAMPLE-FOLDER-NAME>
```

### Developing for your own project

1. Install development version of nextron

```
$ cd nextron
$ npm install
$ npm run build
$ npm link
```

2. Install linked nextron in your project

```
$ cd your-project
$ npm link nextron
```

3. On every change in nextron, run `npm run build` in nextron folder and restart your project

## Maintainers ⚡

- [saltyshiomix (Shiono Yoshihide)](https://github.com/saltyshiomix)
- [lacymorrow (Lacy Morrow)](https://github.com/lacymorrow)
- [Psycokwet](https://github.com/Psycokwet)
- [m5x5](https://github.com/m5x5)
- [andirsun (Anderson Laverde)](https://github.com/andirsun)
- [bm777 (Bayang)](https://github.com/bm777)
- [FranciscoJBrito (Francisco Brito)](https://github.com/FranciscoJBrito)
- [pixelass (Gregor Adams)](https://github.com/pixelass)

For more information, please see [Looking for maintainers ⚡ #244](https://github.com/saltyshiomix/nextron/discussions/244).

## Community

You already create apps with nextron? Feel free to share your apps or services: [Made by nextron? #406](https://github.com/saltyshiomix/nextron/discussions/406)

## Related

- [create-nextron-app](https://github.com/saltyshiomix/create-nextron-app) - Create Nextron (Next.js + Electron) apps in one command ⚡

## License

This project is licensed under the terms of the [MIT license](https://github.com/saltyshiomix/nextron/blob/main/LICENSE).
