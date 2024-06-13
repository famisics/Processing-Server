const express = require('express');
const http = require('http');
const WebSocket = require('ws');

console.log('[wss] 公開サーバーを起動しています');

// HTTPサーバーの設定
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];
let deliverCount = 0;

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('[wss] ローカルサーバーが接続されました');
  ws.on('message', (message) => {
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send('DELIVER:' + message);
        deliverCount++;
      }
      if (client == ws && client.readyState === WebSocket.OPEN) {
        client.send('SUCCESS:'+message);
        console.log('[WSS>Client]', '成功通知', message.toString());
      }
    });
    if (deliverCount > 0) {
      console.log('[WSS>Client]', '配送 x'+deliverCount, message.toString());
    }
    deliverCount = 0;
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
