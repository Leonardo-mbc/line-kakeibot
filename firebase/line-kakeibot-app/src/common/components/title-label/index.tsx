import React from 'react';
import styles from './style.css';

interface Props {
  children: Element | JSX.Element | string;
}

export function TitleLabel({ children }: Props) {
  return <div className={styles.title}>{children}</div>;
}
