import { createServer } from 'http';
import { parse } from 'url';
import * as next from 'next';

const port = 8888;
const app = next({
  dev: true,
  dir: './renderer',
});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res, parse(req.url, true));
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
