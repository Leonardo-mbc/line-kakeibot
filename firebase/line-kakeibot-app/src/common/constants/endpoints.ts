// API エンドポイントの設定

// 開発環境かどうかを判定
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// 本番APIを使用するかどうか（開発中も本番DBを使う場合）
const useProductionAPI = true; // false にするとローカルFunctionsを使用

// ベースURL
const LOCAL_API_BASE = 'http://localhost:5001/line-kakeibot/us-central1';
const PRODUCTION_API_BASE = 'https://us-central1-line-kakeibot.cloudfunctions.net';

// 各エンドポイント
export const ENDPOINTS = {
  getReceipts: useProductionAPI 
    ? `https://getreceiptsv2-hcv64sau7a-uc.a.run.app`
    : `${LOCAL_API_BASE}/getReceiptsV2`,
  getReceiptsByGroup: useProductionAPI
    ? `https://getreceiptsbygroupv2-hcv64sau7a-uc.a.run.app`
    : `${LOCAL_API_BASE}/getReceiptsByGroupV2`,
  deletePayment: useProductionAPI
    ? `https://deletepaymentv2-hcv64sau7a-uc.a.run.app`
    : `${LOCAL_API_BASE}/deletePaymentV2`,
  editPayment: useProductionAPI
    ? `https://editpaymentv2-hcv64sau7a-uc.a.run.app`
    : `${LOCAL_API_BASE}/editPaymentV2`,
  changeBoughtAt: useProductionAPI
    ? `https://us-central1-line-kakeibot.cloudfunctions.net/changeBoughtAt`
    : `${LOCAL_API_BASE}/changeBoughtAt`,
};
