<p align="center"><img src="https://i.imgur.com/NZfsD1p.png"></p>

## Usage

### Create an App

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

### Install Dependencies

Please use `npm install` or `yarn`, not `pnpm install`.

Electron can't handle `pnpm`'s structures of node_modules.

```bash
$ cd my-app

# Install dependencies
$ yarn (or `npm install`)
```

### Use it

```bash
$ cd my-app

# Run development mode
$ yarn dev (or `npm run dev`)

# Build packages
$ yarn build (or `npm run build`)
```
