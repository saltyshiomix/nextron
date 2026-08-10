<p align="center"><img src="../../docs/examples/basic-launch-app-from-url/nextron.gif"></p>

## Usage

This example shows how to open your app from browser URL.

Note: this example works **only production build**!

### Create an App

```
# with npx
$ npx create-nextron-app my-app --example basic-launch-app-from-url

# with yarn
$ yarn create nextron-app my-app --example basic-launch-app-from-url

# with pnpm
$ pnpm dlx create-nextron-app my-app --example basic-launch-app-from-url
```

### Install Dependencies

```
$ cd my-app

# with npm
$ npm install

# with yarn
$ yarn install

# with pnpm
$ pnpm install
```

### Use it

```
# development mode
$ npm run dev (or `yarn dev` or `pnpm run dev`)

# production build
$ npm run build (or `yarn build` or `pnpm run build`)
```

### Open your App

Open `your-custom-protocol://open?token=jwt-value` in your browser, then the app will be shown like a magic!

If you want to change schema URL, please edit `electron-builder.yml#protocols`:

```yml
protocols:
  name: Your App Name
  schemes: [your-custom-protocol-edited]
```

Then, you can see the app from URL: `your-custom-protocol-edited://any-uri-here?data=include-any-data`.

### Useful References

- https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
