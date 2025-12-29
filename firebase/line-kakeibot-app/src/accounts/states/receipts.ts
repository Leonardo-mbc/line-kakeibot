import { selector, atom } from 'recoil';
import { v4 as uuid } from 'uuid';
import { currentTargetState, selectedGroupIdState } from '../states/current';

import { Groups } from '../../common/states/groups';
import { userIdState } from '../../common/states/users';
import { Receipt } from '../../common/interfaces/receipt';
import { Users } from '../../common/interfaces/user';
import { getReceipts } from '../api/receipts';

export interface GroupReceipts {
  [key: string]: Receipt;
}

export interface Receipts {
  [key: string]: GroupReceipts;
}

export interface ReceiptsState {
  groups: Groups;
  users: Users;
  receipts: Receipts;
}

// 初回データ取得（monthStartDay = 1 で取得）
const baseReceiptsState = selector<ReceiptsState>({
  key: 'api/baseReceiptsData',
  get: async ({ get }) => {
    const userId = get(userIdState);
    const currentTarget = get(currentTargetState);
    const _sessionId = get(sessionIdState);

    if (userId && currentTarget) {
      return await getReceipts({ userId, currentTarget, monthStartDay: 1 });
    } else {
      throw new Promise(() => {});
    }
  },
});

// グループ選択時に monthStartDay を考慮して再取得
export const receiptsState = selector<ReceiptsState>({
  key: 'api/getReceiptsData',
  get: async ({ get }) => {
    const userId = get(userIdState);
    const currentTarget = get(currentTargetState);
    const selectedGroupId = get(selectedGroupIdState);
    const _sessionId = get(sessionIdState);
    const baseData = get(baseReceiptsState);

    if (!selectedGroupId || !baseData.groups[selectedGroupId]) {
      return baseData;
    }

    const monthStartDay = baseData.groups[selectedGroupId].monthStartDay || 1;

    if (monthStartDay !== 1) {
      // monthStartDay が1でない場合、再取得
      return await getReceipts({ userId, currentTarget, monthStartDay });
    }

    return baseData;
  },
});

export const sessionIdState = atom({
  key: 'atom:sessionId',
  default: uuid(),
});
