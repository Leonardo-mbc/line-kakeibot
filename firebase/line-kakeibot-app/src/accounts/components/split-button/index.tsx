import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { payOrdersState } from '../../states/pay-order';
import { costsState, totalCostState } from '../../states/costs';
import styles from './style.css';
import { isShowSplitViewState } from '../../states/menu';
import { split } from '../../utilities/split';

export function SplitButton() {
  const costs = useRecoilValue(costsState);
  const totalCost = useRecoilValue(totalCostState);
  const setPayOrders = useSetRecoilState(payOrdersState);
  const setIsShowSplitView = useSetRecoilState(isShowSplitViewState);

  function handleSplit() {
    const payOrder = split({ totalCost, costs });
    setPayOrders(payOrder);
    setIsShowSplitView(true);
  }
  return (
    <div className={styles.container}>
      <button onClick={handleSplit} />
    </div>
  );
}
