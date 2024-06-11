const http = require('http');
const WebSocket = require('ws');

console.log('[wss] 公開サーバーを起動しています');

// HTTPサーバーの設定
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('[wss] ローカルサーバーが接続されました');

  ws.on('message', (message) => {
    console.log('[LOCAL>WSS]','受信' , message.toString('utf8'));
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send('deliver', message);
        console.log('[WSS>LOCAL]', '配信', message.toString('utf8'));
      }
      if (client == ws && client.readyState === WebSocket.OPEN) {
        client.send('success', message);
        console.log('[WSS>LOCAL]', '成功を通知', message.toString('utf8'));
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('[wss] ローカルサーバーが切断されました');
  });
});

server.listen(443, () => {
  console.log(`[wss] 公開サーバーが無事起動しました`);
});
