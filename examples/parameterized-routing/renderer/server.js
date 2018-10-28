const { resolve } = require('path')
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const pathMatch = require('path-match')

const port = 8888
const app = next({
  dev: true,
  dir: './renderer'
})
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    createServer((req, res) => {
      const { pathname, query } = parse(req.url, true)
      const match = pathMatch()('/blog/:id')
      const params = match(pathname)
      if (params === false) {
        handle(req, res)
        return
      }
      app.render(req, res, '/blog', Object.assign(params, query))
    })
    .listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
