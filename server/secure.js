const http = require('http');
const WebSocket = require('ws');
console.log('ローカルサーバーを起動しています');

// HTTPサーバーの設定
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('ローカルサーバーが接続されました。');

  ws.on('message', (message) => {
    console.log('受信したメッセージ:', message);
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    // 送信元に送信が完了したというメッセージを送信
    ws.send('メッセージの送信が完了しました。');
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('ローカルサーバーが切断されました。');
  });
});

const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`公開サーバーはポート ${PORT} で待機中です。`);
});
