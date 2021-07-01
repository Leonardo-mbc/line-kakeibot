import { ExcludedPrice } from '../../common/interfaces/receipt';
import { Group } from '../../common/interfaces/group';
import { Costs } from '../states/costs';
import { GroupReceipts } from '../states/receipts';

interface Split {
  totalCost: number;
  costs: Costs;
}

export function split({ totalCost, costs }: Split) {
  const averageCost = totalCost / Object.keys(costs).length;
  const pays = [];
  const receives = [];

  for (const userId in costs) {
    const cost = costs[userId] - averageCost;
    if (cost < 0) {
      pays.push({ userId, cost: Math.floor(cost) });
    } else if (0 < cost) {
      receives.push({ userId, cost: Math.ceil(cost) });
    }
  }

  const sortedPays = [...pays.sort((a, b) => b.cost - a.cost)];
  const sortedReceives = [...receives.sort((a, b) => b.cost - a.cost)];

  const payOrder: { from: string; to: string; pay: number }[] = [];
  sortedPays.some((w) => {
    sortedReceives.some((m, mi) => {
      if (!m) {
        return true;
      }

      const diff = m.cost + w.cost;
      if (diff < 0) {
        w.cost = diff;
        payOrder.push({ from: w.userId, to: m.userId, pay: m.cost });
        delete sortedReceives[mi];
      } else if (0 < diff) {
        m.cost = diff;
        payOrder.push({ from: w.userId, to: m.userId, pay: -w.cost });
        return true;
      } else {
        payOrder.push({ from: w.userId, to: m.userId, pay: -w.cost });
        return true;
      }
    });
  });

  return payOrder;
}

interface CalcGroupCosts {
  group: Group;
  receipts: GroupReceipts;
}
export function calcGroupCosts({ group, receipts }: CalcGroupCosts) {
  const costs: { [key: string]: number } = {};
  group.users.forEach((userId) => (costs[userId] = 0));

  Object.keys(receipts).forEach((paymentId) => {
    const item = receipts[paymentId];
    if (item.price && item.who) {
      const price = subExcludedPrices(item.price, item.excludedPrices);
      if (costs[item.who]) {
        costs[item.who] += price;
      } else {
        costs[item.who] = price;
      }
    }
  });

  return costs;
}

function subExcludedPrices(price: number, excludedPrices: ExcludedPrice[] | undefined) {
  if (excludedPrices) {
    return price - excludedPrices.reduce((p, c) => p + c.price, 0);
  } else {
    return price;
  }
}

export function calcTotalCost(costs: Costs) {
  return Object.keys(costs).reduce((p, key) => p + costs[key], 0);
}
