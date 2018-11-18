const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const port = 8888
const app = next({
  dev: true,
  dir: './renderer'
})
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res, parse(req.url, true))
    })
    .listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
