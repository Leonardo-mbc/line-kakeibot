import { atom, selector } from 'recoil';
import { SPLIT_RANGE_THIS_MONTH } from '../consts/split';
import { split } from '../utilities/split';
import { splitRangeState, targetCostsState, targetTotalCostState } from './costs';

interface PayOrder {
  from: string;
  to: string;
  pay: number;
}

export const payOrdersState = atom<PayOrder[]>({
  key: 'atom:payOrders',
  default: [],
});

export const targetPayOrdersState = selector({
  key: 'selector/targetPayOrdersState',
  get: async ({ get }) => {
    const splitRange = get(splitRangeState);

    if (splitRange !== SPLIT_RANGE_THIS_MONTH) {
      const targetTotalCost = get(targetTotalCostState);
      const targetCosts = get(targetCostsState);

      return split({ totalCost: targetTotalCost, costs: targetCosts });
    } else {
      return [];
    }
  },
});
