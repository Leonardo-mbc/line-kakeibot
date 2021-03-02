import { Group } from '../../common/states/groups';
import { Users } from '../../common/states/users';
import { ENDPOINT } from '../../common/constants/endpoints';
import { GroupReceipts } from '../states/receipts';

interface GetReceipts {
  userId: string;
  currentTarget: string;
}

export function getReceipts({ userId, currentTarget }: GetReceipts) {
  return fetch(`${ENDPOINT}/getReceipts?userId=${userId}&target=${currentTarget}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
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
    return fetch(`${ENDPOINT}/getReceiptsByGroup?userId=${userId}&groupId=${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
      }),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
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
    `${ENDPOINT}/deletePayment?userId=${userId}&groupId=${selectedGroupId}&currentMonth=${currentTarget}&paymentId=${paymentId}`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw {
        message: 'fetch error',
        status: response.status,
      };
    }
  });
}
