const http = require('http');
const WebSocket = require('ws');

console.log('[wss] wss server is starting...');

// HTTPサーバーの設定
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('[wss] Local server Connected');

  ws.on('message', (message) => {
    console.log('[LOCAL>WSS]', message);
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log('[WSS>LOCAL]', message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('[wss] Local server Disconnected');
  });
});

server.listen(443, () => {
  console.log(`[wss] wss server is running on port 443`);
});
