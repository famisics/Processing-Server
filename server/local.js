const WebSocket = require('ws');
console.log('ローカルサーバーを起動しています');

// ローカルサーバーのセットアップ
const localWss = new WebSocket.Server({ port: 8080 });

// 公開サーバーへの接続
const publicWs = new WebSocket('wss://proc.uiro.dev');

// ローカルサーバーの処理
localWss.on('connection', (ws) => {
  console.log('Processingクライアントが接続されました。');

  ws.on('message', (message) => {
    console.log('Processingから受信したメッセージ:', message);
    if (publicWs.readyState === WebSocket.OPEN) {
      publicWs.send(message);
    } else {
      console.log('公開サーバーに接続できません。');
    }
  });

  publicWs.on('message', (message) => {
    console.log('公開サーバーから受信したメッセージ:', message);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });

  ws.on('close', () => {
    console.log('Processingクライアントが切断されました。');
  });
});

// 公開サーバーの接続処理
publicWs.on('open', () => {
  console.log('公開サーバーに接続されました。');
});

publicWs.on('close', () => {
  console.log('公開サーバーとの接続が切断されました。');
});

publicWs.on('error', (error) => {
  console.error('公開サーバーとの接続エラー:', error);
});
