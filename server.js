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
        client.send(message);
        client.send('相手だけに届いてる？:'+message);
      }
    });
  });
  // クライアントに接続成功メッセージを送信
  ws.send('Welcome to the WebSocket server!');
});

// ExpressアプリケーションでCSPヘッダーを設定
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'connect-src ws://localhost:8080');
  next();
});

// サーバーを起動
server.listen(8080, () => {
  console.log('WebSocket server is running on ws://localhost:8080');
});
