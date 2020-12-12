import React from 'react';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import styles from './style.css';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { getGroups, moveGroup } from '../../api/groups';
import { getReceiptsData, sessionIdState } from '../../api/receipts';
import {
  currentTargetState,
  selectedGroupIdState,
  selectedPaymentState,
} from '../../states/current';
import { isShowLoaderState } from '../../states/loader';
import { hideAllMenuSelector } from '../../states/menu';

export function MoveAccountConfirm() {
  const { groups } = useRecoilValue(getReceiptsData);
  const { state, contents } = useRecoilValueLoadable(getGroups);
  const selectedGroupId = useRecoilValue(selectedGroupIdState);
  const currentTarget = useRecoilValue(currentTargetState);
  const selectedPaymentId = useRecoilValue(selectedPaymentState);
  const setSessionId = useSetRecoilState(sessionIdState);
  const setIsShowLoader = useSetRecoilState(isShowLoaderState);
  const hideAllMenu = useSetRecoilState(hideAllMenuSelector);

  async function selectAccount(e: React.MouseEvent<HTMLSpanElement, MouseEvent>, groupId: string) {
    e.stopPropagation();
    setIsShowLoader(true);
    hideAllMenu(null);
    await moveGroup({ selectedGroupId, groupId, currentTarget, selectedPaymentId });
    setIsShowLoader(false);
    setSessionId(uuid());
  }

  return (
    <div
      className={clsx(styles.container, {
        [styles.loading]: state === 'loading',
      })}>
      <div className={styles.accountListContainer}>
        <span className={styles.accountListTitle}>どの家計簿に移動する？</span>
        <div className={styles.accountList}>
          {state === 'hasValue' && Object.keys(contents).length === 0 ? (
            <span className={styles.noData}>
              移動先家計簿がありません
              <br />
              かけいぼっと設定から新しい家計簿を作成してください
            </span>
          ) : (
            Object.keys(contents)
              .filter((groupId) => groupId !== selectedGroupId)
              .map((groupId, key) => {
                return (
                  <span
                    key={key}
                    className={styles.targetAccount}
                    onClick={(e) => selectAccount(e, groupId)}>
                    {groups[groupId].name}
                  </span>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
