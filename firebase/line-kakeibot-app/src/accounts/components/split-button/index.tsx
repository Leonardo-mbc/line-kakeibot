import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { payOrdersState } from '../../states/pay-order';
import { costsState, totalCostState } from '../../states/costs';
import styles from './style.css';
import { isShowSplitViewState } from '../../states/menu';

export function SplitButton() {
  const costs = useRecoilValue(costsState);
  const totalCost = useRecoilValue(totalCostState);
  const setPayOrders = useSetRecoilState(payOrdersState);
  const setIsShowSplitView = useSetRecoilState(isShowSplitViewState);

  function split() {
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

    setPayOrders(payOrder);
    setIsShowSplitView(true);
  }
  return (
    <div className={styles.container}>
      <button onClick={split} />
    </div>
  );
}
