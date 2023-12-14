import React from 'react';
import styles from './style.css';

interface Props {
  children: React.ReactNode;
}

export function FixedWrapper({ children }: Props) {
  return <div className={styles.container}>{children}</div>;
}
