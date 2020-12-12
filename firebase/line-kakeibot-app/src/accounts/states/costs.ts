import { selector } from 'recoil';
import { getReceiptsData } from '../api/receipts';
import { selectedGroupIdState } from './current';

export interface Costs {
  [key: string]: number;
}

export const costsState = selector<Costs>({
  key: 'selector:costs',
  get: async ({ get }) => {
    const { receipts, groups } = get(getReceiptsData);
    const selectedGroupId = get(selectedGroupIdState);

    if (receipts[selectedGroupId]) {
      const costs: { [key: string]: number } = {};
      groups[selectedGroupId].users.forEach((userId) => (costs[userId] = 0));

      Object.keys(receipts[selectedGroupId]).forEach((paymentId) => {
        const item = receipts[selectedGroupId][paymentId];
        if (item.price && item.who) {
          if (costs[item.who]) {
            costs[item.who] += item.price;
          } else {
            costs[item.who] = item.price;
          }
        }
      });

      return costs;
    } else {
      return {};
    }
  },
});

export const totalCostState = selector({
  key: 'selector/totalCost',
  get: async ({ get }) => {
    const costs = get(costsState);

    return Object.keys(costs).reduce((p, key) => p + costs[key], 0);
  },
});
