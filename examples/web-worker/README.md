<p align="center"><img src="https://i.imgur.com/mq6qMPk.png"></p>

## Usage

### Create an App

```
# with npm
$ npm init nextron-app my-app --example web-worker

# with yarn
$ yarn create nextron-app my-app --example web-worker

# with pnpx
$ pnpx create-nextron-app my-app --example web-worker
```

### Install Dependencies

```
$ cd my-app

# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install --shamefully-hoist
```

### Use it

```
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```
