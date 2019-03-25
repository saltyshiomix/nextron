self.addEventListener('message', (event) => {
  self.postMessage(`Got a message "${event.data}" from Host: so reply "World!"`);
});
