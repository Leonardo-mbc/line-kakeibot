#!/bin/bash

# changeBoughtAt API のテストスクリプト

echo "🧪 changeBoughtAt API テスト"
echo ""

# ローカル or 本番を選択
read -p "環境を選択してください (1: ローカル, 2: 本番): " ENV_CHOICE

if [ "$ENV_CHOICE" == "1" ]; then
    API_URL="http://localhost:5001/line-kakeibot/us-central1/changeBoughtAt"
    echo "📍 ローカル環境でテストします"
else
    API_URL="https://changeboughtat-hcv64sau7a-uc.a.run.app"
    echo "📍 本番環境でテストします"
fi

echo ""
echo "テストデータを入力してください:"
read -p "userId: " USER_ID
read -p "groupId: " GROUP_ID
read -p "paymentId: " PAYMENT_ID
read -p "currentMonth (例: 2025-01): " CURRENT_MONTH
read -p "newBoughtAt (例: 2024-12-28 15:30:00): " NEW_BOUGHT_AT

echo ""
echo "🚀 リクエストを送信します..."
echo ""

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"groupId\": \"$GROUP_ID\",
    \"paymentId\": \"$PAYMENT_ID\",
    \"currentMonth\": \"$CURRENT_MONTH\",
    \"newBoughtAt\": \"$NEW_BOUGHT_AT\"
  }")

# HTTPステータスコードを抽出
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo "📥 レスポンス:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

echo ""
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ 成功 (HTTP $HTTP_CODE)"
else
    echo "❌ エラー (HTTP $HTTP_CODE)"
fi

