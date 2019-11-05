<p align="center"><img src="https://i.imgur.com/kIDlAFT.png"></p>

## Usage

### Create an App

```zsh
# with `nextron`
$ nextron init my-app --example ipc-communication

# with npx
$ npx create-nextron-app my-app --example ipc-communication

# with yarn
$ yarn create nextron-app my-app --example ipc-communication

# with pnpx
$ pnpx create-nextron-app my-app --example ipc-communication
```

### Install Dependencies

```zsh
$ cd my-app

# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install --shamefully-hoist
```

### Use it

```zsh
# development mode
$ yarn dev (or `npm run dev` or `pnpm run dev`)

# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```
