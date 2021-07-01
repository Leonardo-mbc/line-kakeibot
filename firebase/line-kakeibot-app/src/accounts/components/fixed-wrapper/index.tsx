import React from 'react';
import styles from './style.css';

interface Props {
  children: Element | JSX.Element;
}

export function FixedWrapper({ children }: Props) {
  return <div className={styles.container}>{children}</div>;
}
