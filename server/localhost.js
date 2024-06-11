const WebSocket = require('ws');
// ローカルサーバーのセットアップ
const localWss = new WebSocket.Server({ port: 8080 });
// 公開サーバーへの接続
const publicWs = new WebSocket('wss://proc.uiro.dev');

// ローカルサーバーの処理
localWss.on('connection', (ws) => {
  console.log('[local] Processingクライアントが接続されました');

  ws.on('message', (message) => {
    console.log('[PROC>LOCAL]', message);
    if (publicWs.readyState === WebSocket.OPEN) {
      publicWs.send(message);
      console.log('[LOCAL>WSS]', '公開サーバーに送信', message);
    } else {
      console.log('[LOCAL>WSS]', '公開サーバーに接続できません');
    }
  });

  publicWs.on('message', (message) => {
    console.log('[LOCAL>PROC]', message[1], message[2]);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message[1], message[2]);
    }
  });

  ws.on('close', () => {
    console.log('[local] Processingクライアントが切断されました');
  });
});

// 公開サーバーの接続処理
publicWs.on('open', () => {
  console.log('[local] 公開サーバーに接続されました');
});

publicWs.on('close', () => {
  console.log('[local] 公開サーバーとの接続が切断されました');
});

publicWs.on('error', (error) => {
  console.error('[local] 公開サーバーとの接続エラー', error);
});

console.log('[local] ローカルサーバーが起動しました');
