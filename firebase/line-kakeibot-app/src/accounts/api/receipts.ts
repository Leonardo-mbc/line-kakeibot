import { selector, atom } from 'recoil';
import { v4 as uuid } from 'uuid';
import { ENDPOINT } from '../constants/endpoints';
import { currentTargetState } from '../states/current';

import { Groups } from '../states/groups';
import { userIdState, Users } from '../states/users';
import { Receipts } from '../states/receipts';

export interface GetReceiptsData {
  groups: Groups;
  users: Users;
  receipts: Receipts;
}

export const sessionIdState = atom({
  key: 'atom:sessionId',
  default: uuid(),
});

export const getReceiptsData = selector<GetReceiptsData>({
  key: 'api/getReceiptsData',
  get: async ({ get }) => {
    const userId = get(userIdState);
    const currentTarget = get(currentTargetState);
    const _sessionId = get(sessionIdState);

    if (userId && currentTarget) {
      return await _getReceiptsData(userId, currentTarget);
    } else {
      throw new Promise(() => {});
    }
  },
});

function _getReceiptsData(userId: string, currentTarget: string) {
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
