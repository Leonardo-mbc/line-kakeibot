import React from 'react';
import { useRecoilValue } from 'recoil';
import { costsState, totalCostState } from '../../states/costs';
import { receiptsState } from '../../states/receipts';
import { selectedGroupIdState } from '../../states/current';
import styles from './style.css';

interface Props {
  children: Element | JSX.Element;
}

export function UsersList({ children }: Props) {
  const { groups, users } = useRecoilValue(receiptsState);
  const selectedGroupId = useRecoilValue(selectedGroupIdState);
  const costs = useRecoilValue(costsState);
  const totalCost = useRecoilValue(totalCostState);

  return (
    <div className={styles.container}>
      {groups[selectedGroupId] ? (
        groups[selectedGroupId].users.map((userId, key) => {
          return (
            <div key={key} className={styles.user}>
              <span className={styles.name}>{users[userId] || '（名前なし）'}</span>
              <span className={styles.price}>{(costs[userId] || 0).toLocaleString()}</span>
            </div>
          );
        })
      ) : (
        <span className={styles.noData}>データなし</span>
      )}
      {0 < totalCost ? children : null}
    </div>
  );
}
