import React from 'react';
import clsx from 'clsx';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isShowSplitViewState } from '../../states/menu';
import { getReceiptsData } from '../../api/receipts';
import { payOrdersState } from '../../states/pay-order';
import styles from './style.css';

interface Props {
  isShow?: boolean;
}

export function SplitView({ isShow }: Props) {
  const { users } = useRecoilValue(getReceiptsData);
  const payOrders = useRecoilValue(payOrdersState);
  const setIsShowSplitView = useSetRecoilState(isShowSplitViewState);

  function hideSplitView() {
    setIsShowSplitView(false);
  }

  return (
    <div className={clsx(styles.container, { [styles.hide]: !isShow })} onClick={hideSplitView}>
      <div className={styles.splitListContainer}>
        <div className={styles.splitList} onClick={(e) => e.stopPropagation()}>
          <div className={styles.splitListDetail}>
            {Object.keys(users).map((userId, key) => {
              const filteredPayOrder = payOrders.filter((order) => order.from === userId);
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
