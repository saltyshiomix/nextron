<p align="center"><img src="../../docs/examples/basic-launch-app-from-url/nextron.gif"></p>

## Usage

This example shows how to open your app from browser URL.

Note: this example works **only production build**!

### Create an App

```
# with npx
$ npx create-nextron-app my-app --example basic-typescript

# with yarn
$ yarn create nextron-app my-app --example basic-typescript

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-typescript
```

### Install Dependencies

```
$ cd my-app

# using yarn or npm
$ yarn (or `npm install`)

# using pnpm
$ pnpm install --shamefully-hoist
```

### Build it (production mode)

```
# production build
$ yarn build (or `npm run build` or `pnpm run build`)
```

### Open your App

Open `your-custom-protocol-scheme://open` in your browser, then the app will be shown like a magic!

If you want to change schema URL, please edit `electron-builder.yml#protocols`:

```yml
protocols:
  name: Your App Name
  schemes: [your-custom-protocol-scheme-edited]
```

Then, you can see the app from URL: `your-custom-protocol-scheme-edited://any-uri-here-include-any-data`.

### Useful References

- https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
