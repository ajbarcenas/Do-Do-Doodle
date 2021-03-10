const ws  = require('ws');

const client = new ws('ws://localhost:3001');

client.on('open', () => {
  client.send('Hello');
})
