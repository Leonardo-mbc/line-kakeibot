import { selector } from "recoil";

import { userIdState } from "../../common/states/users";
import { Groups } from "../../common/states/groups";

export const getGroups = selector<Groups>({
  key: "api/getGroups",
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
  return fetch(
    `https://getgroupsv2-hcv64sau7a-uc.a.run.app?userId=${userId}`
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
    `https://movepaymentv2-hcv64sau7a-uc.a.run.app?currentGroupId=${selectedGroupId}&targetGroupId=${groupId}&currentMonth=${currentTarget}&paymentId=${selectedPaymentId}`
  ).then((response) => {
    if (!response.ok) {
      throw {
        message: "fetch error",
        status: response.status,
      };
    }
  });
}
