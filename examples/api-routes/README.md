<p align="center"><img src="https://i.imgur.com/TXLXR6J.png"></p>

## Caution When Production Build

It works **only development mode**.

We can't use API routes if the api url is `localhost` (the development server itself) when production!

It is possible to use **only external** API urls with Electron.

## Usage

### Create an App

```bash
# with `nextron`
$ nextron init my-app --example api-routes

# with npx
$ npx create-nextron-app my-app --example api-routes

# with yarn
$ yarn create nextron-app my-app --example api-routes

# with pnpx
$ pnpx create-nextron-app my-app --example api-routes
```

### Use it

```bash
$ cd my-app

# Install dependencies
$ yarn (or `npm install`)

# Run development mode
$ yarn dev (or `npm run dev`)
```
