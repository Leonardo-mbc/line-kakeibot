import React from 'react';
import styles from './style.css';

interface Props {
  title: string;
  subTitle?: Element | JSX.Element | string;
  children: Element | JSX.Element | string;
}

export function Block({ title, subTitle, children }: Props) {
  return (
    <div className={styles.block}>
      <span className={styles.blockTitle}>
        {title}
        {subTitle}
      </span>
      <div className={styles.blockBody}>{children}</div>
    </div>
  );
}
