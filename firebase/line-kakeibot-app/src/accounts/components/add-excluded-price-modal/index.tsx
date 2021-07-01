import React, { useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import clsx from 'clsx';
import styles from './style.css';
import AddIcon from '../../assets/images/add.svg';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { receiptsState, sessionIdState } from '../../states/receipts';
import { userIdState } from '../../../common/states/users';
import {
  currentTargetState,
  selectedGroupIdState,
  selectedPaymentState,
} from '../../states/current';
import { isShowLoaderState } from '../../../common/states/loader';
import { hideAllMenuSelector } from '../../states/menu';
import { stopPropagation } from '../..//utilities/ui';
import { postExcludedPrices } from '../../api/receipts';
import { ExcludedPrice } from '../../../common/interfaces/receipt';
import { SubButton } from './sub-button';

export function AddExcludedPriceModal() {
  const userId = useRecoilValue(userIdState);
  const { receipts } = useRecoilValue(receiptsState);
  const selectedGroupId = useRecoilValue(selectedGroupIdState);
  const currentTarget = useRecoilValue(currentTargetState);
  const selectedPaymentId = useRecoilValue(selectedPaymentState);
  const setSessionId = useSetRecoilState(sessionIdState);
  const setIsShowLoader = useSetRecoilState(isShowLoaderState);
  const hideAllMenu = useSetRecoilState(hideAllMenuSelector);

  const item = receipts[selectedGroupId][selectedPaymentId];
  const [excludedPrices, setExcludedPrices] = useState<ExcludedPrice[]>(item.excludedPrices || []);

  const [isVisibleInput, setIsVisibleInput] = useState(!excludedPrices.length);
  const [isVisibleLabelInput, setIsVisibleLabelInput] = useState(false);
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState(0);

  const readOnly = item.who !== userId;

  const isNoChanged = useMemo(() => {
    return (
      JSON.stringify(excludedPrices) === JSON.stringify(item.excludedPrices || []) ||
      (!item.excludedPrices?.length && !excludedPrices.length)
    );
  }, [excludedPrices]);

  const totalExcludedPrice = useMemo(() => {
    return excludedPrices.reduce((p, c) => p + c.price, 0);
  }, [excludedPrices]);

  function handleContainerClick() {
    hideAllMenu(null);
  }

  function showInput() {
    setIsVisibleInput(true);
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPrice(parseInt(e.target.value));
  }

  function showLabelInput() {
    setIsVisibleLabelInput(true);
  }

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLabel(e.target.value);
  }

  function addExcludedPrice() {
    if (price && !readOnly) {
      setExcludedPrices([
        ...excludedPrices,
        {
          label,
          price: Math.abs(price),
        },
      ]);
      setPrice(0);
      setLabel('');
      setIsVisibleInput(false);
    }
  }

  function removeExcludedPrice(index: number) {
    const tempExcludedPrices = [...excludedPrices];
    tempExcludedPrices.splice(index, 1);
    setExcludedPrices(tempExcludedPrices);
  }

  async function submit() {
    if (!isNoChanged && !readOnly) {
      setIsShowLoader(true);
      await postExcludedPrices({
        userId,
        groupId: selectedGroupId,
        currentTarget,
        selectedPaymentId,
        excludedPrices,
      });
      hideAllMenu(null);
      setIsShowLoader(false);
      setSessionId(uuid());
    }
  }

  return (
    <div className={styles.container} onClick={handleContainerClick}>
      <div className={styles.addExcludedPriceModal} onClick={stopPropagation}>
        <span className={styles.title}>差し引く金額を追加</span>
        <div className={styles.list}>
          {totalExcludedPrice !== 0 && (
            <div className={clsx(styles.excludePricesRow, styles.rawPrice)}>
              <span className={styles.price}>
                <i>元の金額</i>
                {item.price.toLocaleString()}
              </span>
              <span className={styles.rowSpace} onClick={showInput}></span>
            </div>
          )}
          {excludedPrices.map((excludedPrice, index) => {
            return (
              <div className={styles.excludePricesRow} key={`${index}-${uuid()}`}>
                <span className={styles.price}>
                  {excludedPrice.label && <i>{excludedPrice.label}</i>}-
                  {excludedPrice.price.toLocaleString()}
                </span>
                {!readOnly && <SubButton onConfirm={() => removeExcludedPrice(index)} />}
              </div>
            );
          })}
          {isVisibleInput ? (
            <div className={styles.inputContainer}>
              <div className={styles.inputRow}>
                <label>ラベル</label>
                {isVisibleLabelInput ? (
                  <input type="text" onChange={handleLabelChange} />
                ) : (
                  <button className={styles.activateButton} onClick={showLabelInput}>
                    ラベルを付ける
                  </button>
                )}
              </div>
              <div className={styles.inputRow}>
                <label>差引金額</label>
                <input type="number" min={0} onChange={handlePriceChange} />
                <span>円</span>
              </div>
              <span>マイナスで入力する必要はありません</span>
              <button
                className={clsx(styles.addButton, { [styles.disabled]: !price || readOnly })}
                onClick={addExcludedPrice}>
                登録
              </button>
            </div>
          ) : (
            <div className={clsx(styles.excludePricesRow, styles.topBorder)}>
              {totalExcludedPrice !== 0 && (
                <span className={styles.price}>
                  <span className={styles.totalPrice}>差引合計</span>
                  {(item.price - totalExcludedPrice).toLocaleString()}
                </span>
              )}
              {!readOnly && (
                <span className={styles.addContainer} onClick={showInput}>
                  <img src={AddIcon} />
                </span>
              )}
            </div>
          )}
          {!isNoChanged && (
            <button className={styles.submitButton} onClick={submit}>
              保存する
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
