#!/bin/bash

# ローカル開発環境を起動するスクリプト

# スクリプトのディレクトリを取得してプロジェクトルートに移動
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 かけいぼっと - ローカル開発環境を起動します"
echo "📍 現在のディレクトリ: $(pwd)"
echo ""
echo "モードを選択してください:"
echo "1) 開発モード (Webpack Dev Server + ホットリロード)"
echo "2) 本番モード (Firebase Hosting エミュレータ)"
echo ""
read -p "選択 (1 or 2): " MODE

if [ "$MODE" == "2" ]; then
    echo ""
    echo "📦 本番モードを起動します"
    echo "   ⚠️  LIFF アプリをビルドします（少し時間がかかります）"
    echo ""
    
    # ターミナルを2つに分割
    if command -v tmux &> /dev/null; then
        echo "tmux を使用して開発環境を起動します"
        
        # 新しいセッションを作成
        tmux new-session -d -s kakeibot
        
        # ウィンドウを分割
        tmux split-window -h -t kakeibot
        
        # 各ペインでコマンドを実行
        tmux send-keys -t kakeibot:0.0 'cd firebase/functions && echo "📦 Functions をビルド中..." && npm run build && cd .. && echo "🚀 Firebase Emulators を起動中..." && echo "⚠️  Database Emulator は起動しません（本番DBに接続）" && firebase emulators:start --only functions,hosting' C-m
        tmux send-keys -t kakeibot:0.1 'cd firebase/line-kakeibot-app && echo "📦 LIFF アプリをビルド中..." && npm run build && echo "✅ ビルド完了！" && echo "" && echo "📍 アクセス先:" && echo "   - 家計簿: http://localhost:5000/v3/accounts/index.html" && echo "   - 設定: http://localhost:5000/v3/setting/index.html" && echo "   - Functions: http://localhost:5001" && echo "   - Emulator UI: http://localhost:4000" && echo "" && echo "💡 ngrok を起動する場合: ngrok http 5000"' C-m
        
        # セッションにアタッチ
        tmux attach-session -t kakeibot
    else
        echo "⚠️  tmux がインストールされていません"
        echo "手動で以下のコマンドを実行してください:"
        echo ""
        echo "1. LIFF アプリのビルド:"
        echo "   cd firebase/line-kakeibot-app && npm run build"
        echo ""
        echo "2. Firebase Emulators:"
        echo "   cd firebase && firebase emulators:start --only functions,database,hosting"
        echo ""
        echo "3. アクセス先:"
        echo "   http://localhost:5000/v3/accounts/index.html"
    fi
else
    echo ""
    echo "🔧 開発モードを起動します"
    echo ""
    
    # ターミナルを3つに分割して各サービスを起動
    # tmux がインストールされている場合
    if command -v tmux &> /dev/null; then
        echo "tmux を使用して開発環境を起動します"
        
        # 新しいセッションを作成
        tmux new-session -d -s kakeibot
        
        # ウィンドウを分割
        tmux split-window -h -t kakeibot
        tmux split-window -v -t kakeibot
        
        # 各ペインでコマンドを実行
        tmux send-keys -t kakeibot:0.0 'cd firebase/functions && echo "📦 Functions をビルド中..." && npm run build && cd .. && echo "🚀 Firebase Functions Emulator を起動中..." && echo "⚠️  Database Emulator は起動しません（本番DBに接続）" && firebase emulators:start --only functions' C-m
        tmux send-keys -t kakeibot:0.1 'cd firebase/line-kakeibot-app && echo "🚀 Webpack Dev Server を起動中..." && npm run serve' C-m
        tmux send-keys -t kakeibot:0.2 'echo "" && echo "📍 アクセス先:" && echo "   - 家計簿: https://localhost:3000/accounts/index.html" && echo "   - 設定: https://localhost:3000/setting/index.html" && echo "   - Functions: http://localhost:5001" && echo "" && echo "💡 LINEアプリでテストする場合:" && echo "   ngrok http https://localhost:3000"' C-m
        
        # セッションにアタッチ
        tmux attach-session -t kakeibot
        
    else
        echo "⚠️  tmux がインストールされていません"
        echo "手動で以下のコマンドを別々のターミナルで実行してください:"
        echo ""
        echo "1. Firebase Emulators (Functions + Database):"
        echo "   cd firebase/functions && npm run build && cd .. && firebase emulators:start --only functions,database"
        echo ""
        echo "2. LIFF App (開発サーバー):"
        echo "   cd firebase/line-kakeibot-app && npm run serve"
        echo ""
        echo "3. アクセス先:"
        echo "   - 家計簿: https://localhost:3000/accounts/index.html"
        echo "   - 設定: https://localhost:3000/setting/index.html"
        echo ""
        echo "4. ngrok (optional):"
        echo "   ngrok http https://localhost:3000"
    fi
fi

