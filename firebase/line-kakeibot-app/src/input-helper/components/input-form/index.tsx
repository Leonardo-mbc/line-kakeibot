import React from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { formattedPriceState, priceState } from '../../states/input-form';
import styles from './style.css';

const amountButtons = [1, 10, 100, 1000];

export function InputForm() {
  const setAmount = useSetRecoilState(priceState);
  const displayAmount = useRecoilValue(formattedPriceState);

  function addAmount(value: number) {
    setAmount((c) => c + value);
  }

  function inputAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/,|[^0-9]/g, '');
    setAmount(parseInt(value || '0'));
  }

  function clearAmount() {
    setAmount(0);
  }

  return (
    <>
      <div className={styles.inputContainer}>
        <span id="clear" className={styles.clear} onClick={clearAmount}></span>
        <input id="input" type="tel" value={displayAmount} onChange={inputAmount} />
        <span>円</span>
      </div>
      <div className={styles.buttonContainer}>
        {amountButtons.map((value, key) => (
          <button key={key} onClick={() => addAmount(value)}>
            +{value}
          </button>
        ))}
      </div>
    </>
  );
}
