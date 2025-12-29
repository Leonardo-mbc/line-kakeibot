import { atom, selector } from 'recoil';
import * as dayjs from 'dayjs';
import { userIdState } from '../../common/states/users';
import { getReceiptsByGroup } from '../api/receipts';
import {
  SPLIT_RANGE_ALL,
  SPLIT_RANGE_FROM_LAST_MONTH,
  SPLIT_RANGE_THIS_MONTH,
} from '../consts/split';
import { receiptsState, sessionIdState, GroupReceipts } from '../states/receipts';
import { calcGroupCosts, calcTotalCost } from '../utilities/split';
import { currentTargetState, selectedGroupIdState, currentMonthStartDayState } from './current';
import { getMonthRange, isInDisplayMonth } from '../utilities/month-range';

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
    const monthStartDay = get(currentMonthStartDayState);
    const _sessionId = get(sessionIdState);

    if (userId && groupId && splitRange !== SPLIT_RANGE_THIS_MONTH) {
      const receipt = await (async () => {
        switch (splitRange) {
          case SPLIT_RANGE_FROM_LAST_MONTH:
            // monthStartDayを考慮した範囲計算
            const from = getFromMonths(currentTarget, monthStartDay, 2);
            return getReceiptsByGroup({ userId, groupId, from });
          case SPLIT_RANGE_ALL:
            return getReceiptsByGroup({ userId, groupId });
        }
      })();

      if (receipt) {
        // 期間内のレシートのみフィルタリング
        const filteredReceipts = filterReceiptsByRange(
          receipt.receipts,
          currentTarget,
          monthStartDay,
          splitRange
        );
        
        return calcGroupCosts({
          group: receipt.group,
          receipts: filteredReceipts,
        });
      } else {
        return {};
      }
    } else {
      return {};
    }
  },
});

// 複数月のカレンダー月を取得
function getFromMonths(
  currentTarget: string, 
  monthStartDay: number, 
  monthCount: number
): string[] {
  const months = new Set<string>();
  
  for (let i = monthCount - 1; i >= 0; i--) {
    const targetMonth = dayjs(currentTarget).add(-i, 'month').format('YYYY-MM');
    const range = getMonthRange(targetMonth, monthStartDay);
    range.forEach(m => months.add(m));
  }
  
  return Array.from(months);
}

// 期間内のレシートのみフィルタリング
function filterReceiptsByRange(
  receipts: GroupReceipts,
  currentTarget: string,
  monthStartDay: number,
  splitRange: string
): GroupReceipts {
  const filtered: GroupReceipts = {};
  
  Object.keys(receipts).forEach(paymentId => {
    const receipt = receipts[paymentId];
    let shouldInclude = false;
    
    switch (splitRange) {
      case SPLIT_RANGE_FROM_LAST_MONTH:
        // 先月〜今月
        const lastMonth = dayjs(currentTarget).add(-1, 'month').format('YYYY-MM');
        shouldInclude = 
          isInDisplayMonth(receipt.boughtAt, lastMonth, monthStartDay) ||
          isInDisplayMonth(receipt.boughtAt, currentTarget, monthStartDay);
        break;
        
      case SPLIT_RANGE_ALL:
        shouldInclude = true;
        break;
    }
    
    if (shouldInclude) {
      filtered[paymentId] = receipt;
    }
  });
  
  return filtered;
}

export const targetTotalCostState = selector({
  key: 'selector/totaltargetTotalCostStateCost',
  get: ({ get }) => {
    const costs = get(targetCostsState);
    return calcTotalCost(costs);
  },
});
