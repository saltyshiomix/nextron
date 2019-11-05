<p align="center"><img src="https://i.imgur.com/1hAUjRY.png"></p>

## Requirements

- pyinstaller (`pip install pyinstaller`)

## Usage

### Create an App

```zsh
# with `nextron`
$ nextron init my-app --example with-python

# with npx
$ npx create-nextron-app my-app --example with-python

# with yarn
$ yarn create nextron-app my-app --example with-python

# with pnpx
$ pnpx create-nextron-app my-app --example with-python
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
