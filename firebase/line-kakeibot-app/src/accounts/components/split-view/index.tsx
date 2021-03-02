import React from 'react';
import clsx from 'clsx';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { isShowSplitViewState } from '../../states/menu';
import { payOrdersState, targetPayOrdersState } from '../../states/pay-order';
import styles from './style.css';
import { receiptsState } from '../../states/receipts';
import { SPLIT_RANGE, SPLIT_RANGE_THIS_MONTH } from '../../consts/split';
import { splitRangeState, targetCostsState, targetTotalCostState } from '../../states/costs';
import { Loader } from '../../../common/components/loader';

interface Props {
  isShow?: boolean;
}

export function SplitView({ isShow }: Props) {
  const { users } = useRecoilValue(receiptsState);
  const payOrders = useRecoilValue(payOrdersState);
  const targetPayOrdersLoadable = useRecoilValueLoadable(targetPayOrdersState);
  const setIsShowSplitView = useSetRecoilState(isShowSplitViewState);
  const [splitRange, setSplitRange] = useRecoilState(splitRangeState);

  function hideSplitView() {
    setIsShowSplitView(false);
  }

  async function changeRange(key: string) {
    setSplitRange(key);
  }

  function handleTransitionEnd() {
    if (!isShow) {
      setSplitRange(SPLIT_RANGE_THIS_MONTH);
    }
  }

  return (
    <div
      className={clsx(styles.container, { [styles.hide]: !isShow })}
      onClick={hideSplitView}
      onTransitionEnd={handleTransitionEnd}>
      <div className={styles.splitListContainer}>
        <div className={styles.splitList} onClick={(e) => e.stopPropagation()}>
          <div className={styles.splitRange}>
            {SPLIT_RANGE.map((range) => (
              <button
                key={range.key}
                className={clsx({ [styles.active]: splitRange === range.key })}
                onClick={() => changeRange(range.key)}>
                {range.label}
              </button>
            ))}
          </div>
          <div className={styles.splitListDetail}>
            {targetPayOrdersLoadable.state === 'hasValue' ? (
              Object.keys(users).map((userId, key) => {
                const filteredPayOrder = (splitRange === SPLIT_RANGE_THIS_MONTH
                  ? payOrders
                  : targetPayOrdersLoadable.contents
                ).filter((order) => order.from === userId);
                return filteredPayOrder.length ? (
                  <div key={key} className={styles.payUser}>
                    <span className={styles.from}>
                      <i>{users[userId]}</i>
                    </span>
                    {filteredPayOrder.map(({ pay, to }, key) => (
                      <span key={key} className={styles.to}>
                        <span className={styles.name}>
                          <i>{users[to]}</i>
                        </span>
                        <span className={styles.price}>{pay.toLocaleString()}</span>
                      </span>
                    ))}
                  </div>
                ) : null;
              })
            ) : (
              <div className={styles.loaderContainer}>
                <Loader inline isShow />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
