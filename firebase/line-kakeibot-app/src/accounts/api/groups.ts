import { selector } from 'recoil';
import { ENDPOINT } from '../constants/endpoints';

import { userIdState } from '../states/users';
import { Groups } from '../states/groups';

export const getGroups = selector<Groups>({
  key: 'api/getGroups',
  get: async ({ get }) => {
    const userId = get(userIdState);
    if (userId) {
      return await _getGroups(userId);
    } else {
      return {};
    }
  },
});

function _getGroups(userId: string) {
  return fetch(`${ENDPOINT}/getGroups?userId=${userId}`).then((response) => {
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

interface MoveGroup {
  groupId: string;
  selectedGroupId: string;
  currentTarget: string;
  selectedPaymentId: string;
}

export function moveGroup({
  groupId,
  selectedGroupId,
  currentTarget,
  selectedPaymentId,
}: MoveGroup) {
  return fetch(
    `${ENDPOINT}/movePayment?currentGroupId=${selectedGroupId}&targetGroupId=${groupId}&currentMonth=${currentTarget}&paymentId=${selectedPaymentId}`
  ).then((response) => {
    if (!response.ok) {
      throw {
        message: 'fetch error',
        status: response.status,
      };
    }
  });
}
