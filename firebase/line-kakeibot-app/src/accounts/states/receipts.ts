import { selector, atom } from 'recoil';
import { v4 as uuid } from 'uuid';
import { User } from '../../common/states/users';
import { currentTargetState } from '../states/current';

import { Groups } from '../../common/states/groups';
import { userIdState, Users } from '../../common/states/users';
import { getReceipts } from '../api/receipts';
export interface Receipt {
  boughtAt: string;
  imageUrl: string;
  place: string;
  price: number;
  who: User;
}

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

export const receiptsState = selector<ReceiptsState>({
  key: 'api/getReceiptsData',
  get: async ({ get }) => {
    const userId = get(userIdState);
    const currentTarget = get(currentTargetState);
    const _sessionId = get(sessionIdState);

    if (userId && currentTarget) {
      return await getReceipts({ userId, currentTarget });
    } else {
      throw new Promise(() => {});
    }
  },
});

export const sessionIdState = atom({
  key: 'atom:sessionId',
  default: uuid(),
});
