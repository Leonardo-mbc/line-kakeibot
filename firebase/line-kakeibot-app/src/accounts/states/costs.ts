import { atom, selector } from 'recoil';
import * as dayjs from 'dayjs';
import { userIdState } from '../../common/states/users';
import { getReceiptsByGroup } from '../api/receipts';
import {
  SPLIT_RANGE_ALL,
  SPLIT_RANGE_FROM_LAST_MONTH,
  SPLIT_RANGE_THIS_MONTH,
} from '../consts/split';
import { receiptsState, sessionIdState } from '../states/receipts';
import { calcGroupCosts, calcTotalCost } from '../utilities/split';
import { currentTargetState, selectedGroupIdState } from './current';

export interface Costs {
  [key: string]: number;
}

export const costsState = selector<Costs>({
  key: 'selector:costs',
  get: async ({ get }) => {
    const { receipts, groups } = get(receiptsState);
    const selectedGroupId = get(selectedGroupIdState);

    if (receipts[selectedGroupId]) {
      return calcGroupCosts({
        group: groups[selectedGroupId],
        receipts: receipts[selectedGroupId],
      });
    } else {
      return {};
    }
  },
});

export const totalCostState = selector({
  key: 'selector/totalCost',
  get: async ({ get }) => {
    const costs = get(costsState);
    return calcTotalCost(costs);
  },
});

export const splitRangeState = atom({
  key: 'atom:splitRangeState',
  default: SPLIT_RANGE_THIS_MONTH,
});

export const targetCostsState = selector<Costs>({
  key: 'selector:targetCostsState',
  get: async ({ get }) => {
    const groupId = get(selectedGroupIdState);
    const userId = get(userIdState);
    const splitRange = get(splitRangeState);
    const currentTarget = get(currentTargetState);
    const _sessionId = get(sessionIdState);

    if (userId && groupId && splitRange !== SPLIT_RANGE_THIS_MONTH) {
      const receipt = await (async () => {
        switch (splitRange) {
          case SPLIT_RANGE_FROM_LAST_MONTH:
            const from = [
              dayjs(currentTarget).add(-1, 'month').format('YYYY-MM'),
              dayjs(currentTarget).format('YYYY-MM'),
            ];
            return getReceiptsByGroup({ userId, groupId, from });
          case SPLIT_RANGE_ALL:
            return getReceiptsByGroup({ userId, groupId });
        }
      })();

      if (receipt) {
        return calcGroupCosts({
          group: receipt.group,
          receipts: receipt.receipts,
        });
      } else {
        return {};
      }
    } else {
      return {};
    }
  },
});

export const targetTotalCostState = selector({
  key: 'selector/totaltargetTotalCostStateCost',
  get: ({ get }) => {
    const costs = get(targetCostsState);
    return calcTotalCost(costs);
  },
});
