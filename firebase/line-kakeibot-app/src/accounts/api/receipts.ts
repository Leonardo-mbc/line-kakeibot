import { Group } from "../../common/interfaces/group";
import { Users } from "../../common/interfaces/user";
import { ENDPOINTS } from "../../common/constants/endpoints";
import { getMonthRange, isInDisplayMonth } from "../utilities/month-range";

import { GroupReceipts } from "../states/receipts";
import { ExcludedPrice } from "../../common/interfaces/receipt";

interface GetReceipts {
  userId: string;
  currentTarget: string;
  monthStartDay?: number;
}

export function getReceipts({ userId, currentTarget, monthStartDay = 1 }: GetReceipts) {
  const months = getMonthRange(currentTarget, monthStartDay);
  
  if (months.length === 1) {
    // 従来通り（1日始まり）
    return fetch(
      `https://getreceiptsv2-hcv64sau7a-uc.a.run.app?userId=${userId}&target=${currentTarget}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw {
            message: "fetch error",
            status: response.status,
          };
        }
      });
  } else {
    // 複数月のデータを取得してマージ
    return Promise.all(
      months.map(month => 
        fetch(
          `https://getreceiptsv2-hcv64sau7a-uc.a.run.app?userId=${userId}&target=${month}`
        ).then(res => res.ok ? res.json() : { receipts: {}, users: {}, groups: {} })
      )
    ).then(results => {
      return mergeAndFilterReceipts(results, currentTarget, monthStartDay);
    });
  }
}

function mergeAndFilterReceipts(results: any[], displayMonth: string, monthStartDay: number) {
  const merged = {
    receipts: {} as any,
    users: {} as any,
    groups: {} as any,
  };
  
  results.forEach(result => {
    // ユーザーとグループ情報をマージ
    Object.assign(merged.users, result.users || {});
    Object.assign(merged.groups, result.groups || {});
    
    // レシートは表示月に属するものだけをフィルタリング
    if (result.receipts) {
      Object.keys(result.receipts).forEach(groupId => {
        if (!merged.receipts[groupId]) {
          merged.receipts[groupId] = {};
        }
        
        Object.keys(result.receipts[groupId] || {}).forEach(paymentId => {
          const receipt = result.receipts[groupId][paymentId];
          
          // 表示月に属するかチェック
          if (receipt.boughtAt && isInDisplayMonth(receipt.boughtAt, displayMonth, monthStartDay)) {
            merged.receipts[groupId][paymentId] = receipt;
          }
        });
      });
    }
  });
  
  return merged;
}

interface GetReceiptsByGroup {
  userId: string;
  groupId: string;
  from?: string[];
}

interface GetReceiptsByGroupResponse {
  group: Group;
  receipts: GroupReceipts;
  users: Users;
}

export function getReceiptsByGroup({
  userId,
  groupId,
  from,
}: GetReceiptsByGroup): Promise<GetReceiptsByGroupResponse | null> {
  if (userId && groupId) {
    return fetch(
      `https://getreceiptsbygroupv2-hcv64sau7a-uc.a.run.app?userId=${userId}&groupId=${groupId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
        }),
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: "fetch error",
          status: response.status,
        };
      }
    });
  } else {
    return Promise.resolve(null);
  }
}

interface DeletePayment {
  userId: string;
  selectedGroupId: string;
  currentTarget: string;
  paymentId: string;
}

export function deletePayment({
  userId,
  selectedGroupId,
  currentTarget,
  paymentId,
}: DeletePayment) {
  return fetch(
    `https://deletepaymentv2-hcv64sau7a-uc.a.run.app?userId=${userId}&groupId=${selectedGroupId}&currentMonth=${currentTarget}&paymentId=${paymentId}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw {
        message: "fetch error",
        status: response.status,
      };
    }
  });
}

interface PostExcludedPrices {
  userId: string;
  groupId: string;
  currentTarget: string;
  selectedPaymentId: string;
  excludedPrices: ExcludedPrice[];
}

export function postExcludedPrices({
  userId,
  groupId,
  currentTarget,
  selectedPaymentId,
  excludedPrices,
}: PostExcludedPrices) {
  return fetch(
    `https://editpaymentv2-hcv64sau7a-uc.a.run.app?userId=${userId}&groupId=${groupId}&currentMonth=${currentTarget}&paymentId=${selectedPaymentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ excludedPrices }),
    }
  ).then((response) => {
    if (!response.ok) {
      throw {
        message: "fetch error",
        status: response.status,
      };
    }
  });
}

interface ChangeBoughtAt {
  userId: string;
  groupId: string;
  paymentId: string;
  currentMonth: string;
  newBoughtAt: string;
}

export function changeBoughtAt({
  userId,
  groupId,
  paymentId,
  currentMonth,
  newBoughtAt,
}: ChangeBoughtAt) {
  return fetch(ENDPOINTS.changeBoughtAt, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      groupId,
      paymentId,
      currentMonth,
      newBoughtAt,
    }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw {
        message: "fetch error",
        status: response.status,
      };
    }
  });
}
