import React, { useMemo } from 'react';
import liff from '@line/liff';
import clsx from 'clsx';
import styles from './style.css';
import EditPen from '../../assets/images/edit-pen.svg';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { receiptsState } from '../../states/receipts';
import { selectedGroupIdState, selectedPaymentState } from '../../states/current';
import { userIdState } from '../../../common/states/users';
import dayjs from 'dayjs';
import { isShowMenuState } from '../../states/menu';

export function DetailsList() {
  const { receipts, users } = useRecoilValue(receiptsState);
  const selectedGroupId = useRecoilValue(selectedGroupIdState);
  const userId = useRecoilValue(userIdState);
  const setIsShowMenu = useSetRecoilState(isShowMenuState);
  const [selectedPayment, setSelectedPayment] = useRecoilState(selectedPaymentState);

  const descPaymentIds = useMemo(() => {
    if (receipts[selectedGroupId]) {
      return Object.keys(receipts[selectedGroupId]).sort((a, b) => {
        const dateA = dayjs(receipts[selectedGroupId][a].boughtAt);
        const dateB = dayjs(receipts[selectedGroupId][b].boughtAt);
        if (dateA.isBefore(dateB)) {
          return 1;
        } else if (dateB.isBefore(dateA)) {
          return -1;
        } else {
          return 0;
        }
      });
    } else {
      return [];
    }
  }, [receipts, selectedGroupId]);

  function showReceiptImage(imageUrl: string) {
    liff.openWindow({ url: imageUrl });
  }

  function showMenu(paymentId: string) {
    setSelectedPayment(paymentId);
    setIsShowMenu(true);
  }

  return (
    <div className={styles.container}>
      <div className={styles.detailsLabel}>
        <span>うちわけ</span>
      </div>
      <div className={styles.detailsTable}>
        {descPaymentIds.length ? (
          descPaymentIds.map((paymentId, key) => {
            const item = receipts[selectedGroupId][paymentId];
            return (
              <div
                key={key}
                className={clsx(styles.detail, {
                  [styles.selected]: paymentId === selectedPayment,
                })}>
                {item.imageUrl ? (
                  <div className={styles.imageContainer}>
                    <img
                      onClick={() => showReceiptImage(item.imageUrl)}
                      className={styles.receiptImage}
                      src={item.imageUrl}
                    />
                  </div>
                ) : null}
                <div className={styles.detailItem}>
                  <div className={styles.left}>
                    <span>{item.place}</span>
                    <span className={styles.lightWeight}>{users[item.who]}</span>
                  </div>
                  <div className={styles.right}>
                    <span>{item.price.toLocaleString()}</span>
                    <span className={styles.lightWeight}>
                      {dayjs(item.boughtAt).format('MM/DD')}
                    </span>
                  </div>
                </div>
                <img
                  className={clsx(styles.detailEdit, { [styles.hide]: userId !== item.who })}
                  src={EditPen}
                  onClick={() => showMenu(paymentId)}
                />
              </div>
            );
          })
        ) : (
          <span className={styles.noData}>データなし</span>
        )}
      </div>
    </div>
  );
}
