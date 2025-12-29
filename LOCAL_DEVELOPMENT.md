# ローカル開発環境セットアップ

## 前提条件

- Node.js 20以上
- Firebase CLI
- LINEの開発者アカウント

## 1. Firebase Functions のローカル実行

### 1-1. 依存関係のインストール

```bash
cd firebase/functions
npm install
```

### 1-2. ビルド

```bash
npm run build
```

### 1-3. Firebase Emulator の起動

```bash
cd ../  # firebase ディレクトリに移動
firebase emulators:start --only functions
```

ローカルエンドポイントは `http://localhost:5001/line-kakeibot/us-central1/` にマウントされます。

例:
- `changeBoughtAt`: http://localhost:5001/line-kakeibot/us-central1/changeBoughtAt
- `getReceiptsV2`: http://localhost:5001/line-kakeibot/us-central1/getReceiptsV2

## 2. LIFF アプリのローカル実行

### 2-1. 依存関係のインストール

```bash
cd firebase/line-kakeibot-app
npm install
```

### 2-2. 開発サーバーの起動

```bash
npm run serve
```

Webpack Dev Server が起動し、以下のURLでアクセスできます:

⚠️ **HTTPS** と **ポート3000** に注意してください

**開発モード（Webpack Dev Server）のURL:**
- https://localhost:3000/accounts/index.html - 家計簿画面
- https://localhost:3000/setting/index.html - 設定画面
- https://localhost:3000/input-helper/index.html - 金額入力補助

**本番モード（Hosting Emulator）のURL:**
- http://localhost:5000/v3/accounts/index.html - 家計簿画面
- http://localhost:5000/v3/setting/index.html - 設定画面
- http://localhost:5000/v3/input-helper/index.html - 金額入力補助

### 2-3. ローカルエンドポイントの設定

開発時にローカルのFirebase Functionsを使用する場合、API呼び出しのURLを変更します:

`firebase/line-kakeibot-app/src/accounts/api/receipts.ts` を一時的に修正:

```typescript
// 本番
const API_BASE_URL = "https://changeboughtat-hcv64sau7a-uc.a.run.app";

// ローカル開発時
const API_BASE_URL = "http://localhost:5001/line-kakeibot/us-central1/changeBoughtAt";
```

または、環境変数で切り替え:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? "http://localhost:5001/line-kakeibot/us-central1/changeBoughtAt"
  : "https://changeboughtat-hcv64sau7a-uc.a.run.app";
```

## 3. データベース接続

### 3-1. サービスアカウントキーの配置

Firebase Admin SDKが本番のFirebase Realtime Databaseに接続します:

`firebase/functions/src/constants/service-account-key.json`

このファイルは `.gitignore` に含まれているため、コミットされません。

### 3-2. ローカルエミュレータを使用する場合

完全にローカルで動作させる場合:

```bash
cd firebase
firebase emulators:start --only functions,database
```

`firebase/functions/src/utilities/firebase-app.ts` を修正:

```typescript
// 開発時
if (process.env.FUNCTIONS_EMULATOR) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "http://localhost:9000/?ns=line-kakeibot"
  });
} else {
  // 本番
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://line-kakeibot.firebaseio.com'
  });
}
```

## 4. LIFF のテスト

### 4-1. ngrok を使用

LIFFはHTTPSが必要なため、ローカル開発時は ngrok を使用:

```bash
ngrok http https://localhost:3000
```

ngrokが発行するHTTPS URLをLINE Developers コンソールの LIFF エンドポイントURLに設定します。

### 4-2. LIFF IDの確認

`webpack.config.js` の DEBUG_PLUGINS セクションにLIFF IDが記載されています:

- 家計簿: `1629647599-oBkvPgEm`
- 設定: `1629647599-9WRVLZA3`
- 金額入力: `1629647599-EA2RxkgW`

## 5. デバッグのヒント

### フロントエンド

ブラウザの開発者ツールでコンソールを確認:

```javascript
// vConsoleが有効な場合、画面右下にアイコンが表示されます
```

### バックエンド

Firebase Functions のログを確認:

```bash
# ローカル
firebase emulators:start --only functions

# 本番
firebase functions:log
```

### APIリクエストのテスト

curlでエンドポイントをテスト:

```bash
# ローカル
curl -X POST http://localhost:5001/line-kakeibot/us-central1/changeBoughtAt \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-id",
    "groupId": "test-group-id",
    "paymentId": "test-payment-id",
    "currentMonth": "2025-01",
    "newBoughtAt": "2024-12-28 15:30:00"
  }'
```

## 6. よくある問題

### 問題: CORS エラー

**解決策**: Firebase Functions は CORS ヘッダーを返しています。ローカル開発時は `Access-Control-Allow-Origin: *` が設定されているか確認。

### 問題: LIFF が初期化されない

**解決策**: 
1. HTTPS経由でアクセスしているか確認（ngrok使用）
2. 正しいLIFF IDが設定されているか確認
3. LINE開発者コンソールでLIFFのエンドポイントURLが正しいか確認

### 問題: Firebase Admin SDK の認証エラー

**解決策**: `service-account-key.json` が正しく配置されているか確認。

## 7. 日付変更機能のテスト手順

1. Firebase Emulatorを起動
2. LIFF アプリの開発サーバーを起動
3. ngrokでHTTPSトンネルを作成
4. LINEアプリでLIFFを開く
5. レシート詳細の編集メニューから「日付を変更」を選択
6. 日付を選択して保存
7. データが正しく移動されたか確認（月が変わる場合）

## 8. デプロイ

### Firebase Functions

```bash
cd firebase/functions
npm run build
cd ..
firebase deploy --only functions
```

### LIFF アプリ

```bash
cd firebase/line-kakeibot-app
npm run build
cd ..
firebase deploy --only hosting
```

## 9. 環境変数（オプション）

`.env.local` ファイルを作成して環境ごとの設定を管理:

```bash
# .env.local
NODE_ENV=development
API_BASE_URL=http://localhost:5001/line-kakeibot/us-central1
```

webpack.config.js で読み込み:

```javascript
require('dotenv').config({ path: '.env.local' });
```

