# 日付変更機能 - 変更履歴

## 概要

レシートの購入日を後から変更できる機能を追加しました。

## 実装内容

### 1. バックエンド (Firebase Functions)

#### 新規ファイル
- `firebase/functions/src/actions/change-bought-at.ts` - 日付変更のビジネスロジック
- `firebase/functions/src/endpoints/change-bought-at.ts` - HTTPエンドポイント

#### 変更ファイル
- `firebase/functions/src/index.ts` - 新しいエンドポイントをエクスポート

#### 機能
- レシートの `boughtAt` フィールドを更新
- 月が変わる場合は自動的に別の月ディレクトリに移動
  - 例: `2025-01-15` → `2024-12-28` の場合、`/payments/{groupId}/2025-01/{paymentId}` から `/payments/{groupId}/2024-12/{paymentId}` に移動
- 権限チェック: レシートの作成者のみ変更可能
- トランザクション的な処理で整合性を保証

### 2. フロントエンド (LIFF App)

#### 新規ファイル
- `firebase/line-kakeibot-app/src/accounts/components/change-date-modal/index.tsx` - 日付変更モーダルコンポーネント
- `firebase/line-kakeibot-app/src/accounts/components/change-date-modal/style.css` - スタイル
- `firebase/line-kakeibot-app/src/accounts/components/change-date-modal/style.css.d.ts` - TypeScript型定義
- `firebase/line-kakeibot-app/src/common/constants/endpoints.ts` - エンドポイント設定

#### 変更ファイル
- `firebase/line-kakeibot-app/src/accounts/api/receipts.ts` - `changeBoughtAt` API関数を追加
- `firebase/line-kakeibot-app/src/accounts/states/menu.ts` - 日付変更モーダルの状態管理を追加
- `firebase/line-kakeibot-app/src/accounts/components/full-screen-menu/index.tsx` - メニューに「日付を変更」を追加
- `firebase/line-kakeibot-app/src/accounts/index.tsx` - ChangeDateModalを統合

#### UI/UX
- レシート編集メニューに「日付を変更」オプションを追加（最上部）
- カレンダーUIで日付を選択
- 月が変わる場合は警告メッセージを表示
- 時刻は変更不可（元の時刻を維持）
- グループの終了日と今日の日付を考慮した入力制限

### 3. 開発環境

#### 新規ファイル
- `LOCAL_DEVELOPMENT.md` - ローカル開発環境のセットアップ手順
- `dev-start.sh` - 開発環境起動スクリプト
- `firebase/line-kakeibot-app/src/common/constants/endpoints.ts` - 環境別エンドポイント設定

## エンドポイント

### changeBoughtAt

**URL (本番)**: `https://changeboughtat-hcv64sau7a-uc.a.run.app`

**メソッド**: POST

**リクエストボディ**:
```json
{
  "userId": "U1234567890abcdef",
  "groupId": "group-uuid",
  "paymentId": "payment-uuid",
  "currentMonth": "2025-01",
  "newBoughtAt": "2024-12-28 15:30:00"
}
```

**レスポンス (成功)**:
```json
{
  "success": true,
  "moved": true,
  "oldMonth": "2025-01",
  "newMonth": "2024-12",
  "boughtAt": "2024-12-28 15:30:00"
}
```

**レスポンス (エラー)**:
```json
{
  "message": "Payment not found"
}
```

**ステータスコード**:
- 200: 成功
- 400: 不正なリクエスト
- 403: 権限なし
- 404: レシートが見つからない
- 500: サーバーエラー

## テスト手順

### ローカル環境

1. **Firebase Functions を起動**
```bash
cd firebase/functions
npm run build
cd ..
firebase emulators:start --only functions
```

2. **LIFF アプリを起動**
```bash
cd firebase/line-kakeibot-app
npm run serve
```

3. **ngrok でHTTPSトンネルを作成**
```bash
ngrok http 8080
```

4. **LINE Developers コンソールで LIFF URL を更新**
   - ngrokのHTTPS URLを設定

5. **LINEアプリでテスト**
   - レシート詳細を開く
   - 編集メニューから「日付を変更」を選択
   - 日付を選択して保存
   - データが正しく更新されたか確認

### 本番環境

1. **デプロイ**
```bash
# Functions
cd firebase/functions
npm run build
cd ..
firebase deploy --only functions:changeBoughtAt

# LIFF App
cd line-kakeibot-app
npm run build
cd ..
firebase deploy --only hosting
```

2. **動作確認**
   - LINEアプリから実際の家計簿を開く
   - テスト用のレシートを作成
   - 日付を変更してみる
   - 月が変わる場合と同月内の変更を両方テスト

## チェックリスト

### 実装
- [x] バックエンドのアクション実装
- [x] バックエンドのエンドポイント実装
- [x] フロントエンドのモーダルコンポーネント実装
- [x] メニューへの統合
- [x] API連携
- [x] エラーハンドリング
- [x] ローカル開発環境の設定

### テスト
- [ ] 同月内での日付変更
- [ ] 月を跨ぐ日付変更
- [ ] 未来の日付を選択できないことを確認
- [ ] グループ終了日以降の日付を選択できないことを確認
- [ ] 他人のレシートを変更できないことを確認
- [ ] 月が変わる場合の警告表示
- [ ] データ再取得後に正しく表示される
- [ ] 割り勘計算への影響確認

### デプロイ
- [ ] Functions のビルド確認
- [ ] LIFF アプリのビルド確認
- [ ] 本番環境へのデプロイ
- [ ] 本番環境での動作確認

## 既知の問題・制約

1. **時刻は変更できない**
   - 現在の仕様では日付のみ変更可能
   - 時刻を変更したい場合は将来の機能拡張が必要

2. **グループ作成日より前の日付**
   - UI上は制限していないが、実際のグループ作成日を取得して制限する機能は未実装
   - 現在は固定値（2020-01-01）を最小日として使用

3. **ローカル開発時のCORS**
   - ローカルエミュレータとLIFFアプリ間でCORSエラーが発生する可能性
   - Firebase Functions は既に CORS ヘッダーを設定済み

## 今後の拡張案

1. **時刻の変更**
   - 日付と時刻を別々に設定できるUI

2. **一括変更**
   - 複数のレシートを選択して一括で日付変更

3. **変更履歴**
   - いつ誰が日付を変更したかの履歴を記録

4. **通知**
   - グループメンバーに日付変更を通知

## 関連ドキュメント

- [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) - ローカル開発環境のセットアップ
- [README.md](./README.md) - プロジェクト概要

