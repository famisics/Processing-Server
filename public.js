const express = require('express');
const http = require('http');
const WebSocket = require('ws');

console.log('[wss] 公開サーバーを起動しています');

// HTTPサーバーの設定
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('[wss] ローカルサーバーが接続されました');
  ws.on('message', (message) => {
    console.log('[WSS>Client]', message.toString());
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send('DELIVER:'+message);
      }
      if (client == ws && client.readyState === WebSocket.OPEN) {
        client.send('SUCCESS:'+message);
      }
    });
  });
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('[wss] ローカルサーバーが切断されました');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`[wss] 公開サーバーが ${PORT} で無事起動しました`);
});
