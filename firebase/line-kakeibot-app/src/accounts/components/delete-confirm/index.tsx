import React from 'react';
import clsx from 'clsx';
import { v4 as uuid } from 'uuid';
import styles from './style.css';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { deletePayment, sessionIdState } from '../../api/receipts';
import {
  currentTargetState,
  selectedGroupIdState,
  selectedPaymentState,
} from '../../states/current';
import { userIdState } from '../../../common/states/users';
import { isShowLoaderState } from '../../../common/states/loader';
import { hideAllMenuSelector } from '../../states/menu';

export function DeleteConfirm() {
  const userId = useRecoilValue(userIdState);
  const selectedGroupId = useRecoilValue(selectedGroupIdState);
  const currentTarget = useRecoilValue(currentTargetState);
  const selectedPaymentId = useRecoilValue(selectedPaymentState);
  const setSessionId = useSetRecoilState(sessionIdState);
  const setIsShowLoader = useSetRecoilState(isShowLoaderState);
  const hideAllMenu = useSetRecoilState(hideAllMenuSelector);

  async function submit(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.stopPropagation();
    setIsShowLoader(true);
    hideAllMenu(null);
    await deletePayment({ userId, selectedGroupId, currentTarget, paymentId: selectedPaymentId });
    setIsShowLoader(false);
    setSessionId(uuid());
  }

  return (
    <div className={styles.container}>
      <div className={styles.deleteConfirm}>
        <span>本当に削除しますか</span>
        <div className={styles.deleteAnswers}>
          <span className={clsx(styles.deleteButton, styles.yes)} onClick={submit}>
            はい
          </span>
          <span className={clsx(styles.deleteButton, styles.cancel)}>キャンセル</span>
        </div>
      </div>
    </div>
  );
}
