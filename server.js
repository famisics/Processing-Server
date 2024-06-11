const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket接続が確立されたときの処理
wss.on('connection', function connection(ws) {
  // クライアントからメッセージを受信したときの処理
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // 受け取ったメッセージを全クライアントに送信
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send('[Websocket:RECEIVED] '+message);
      }
      if (client == ws && client.readyState === WebSocket.OPEN) {
        client.send('[Websocket:SENT]:'+message);
      }
    });
  });
  // クライアントに接続成功メッセージを送信
  ws.send('Welcome to the WebSocket server!');
});

// サーバーを起動
server.listen(443, () => {
  console.log('WebSocket server is running');
});
