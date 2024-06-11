const http = require('http');
const WebSocket = require('ws');

console.log('[wss] 公開サーバーを起動しています');

// HTTPサーバーの設定
// const server = http.createServer();
// const wss = new WebSocket.Server({ server });

const wss = new WebSocket.Server({ port: 8081 });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);
  console.log('[wss] ローカルサーバーが接続されました');
  ws.on('message', (message) => {
    console.log('[LOCAL>WSS]', 'receive' , message);
    clients.forEach(client => {
      // if (client !== ws && client.readyState === WebSocket.OPEN) {
      //   client.send(message);
      //   console.log('[WSS>LOCAL]', 'deliver', message);
      // }
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        console.log('[WSS>LOCAL]', 'deliver', message);
      }
    });
  });
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('[wss] ローカルサーバーが切断されました');
  });
});

// server.listen(443, () => {
//   console.log(`[wss] 公開サーバーが無事起動しました`);
// });
