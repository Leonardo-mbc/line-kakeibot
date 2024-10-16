import { Group } from "../../common/interfaces/group";
import { Users } from "../../common/interfaces/user";

import { GroupReceipts } from "../states/receipts";
import { ExcludedPrice } from "../../common/interfaces/receipt";

interface GetReceipts {
  userId: string;
  currentTarget: string;
}

export function getReceipts({ userId, currentTarget }: GetReceipts) {
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
    })
    .then((receipts) => {
      return receipts;
    });
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
