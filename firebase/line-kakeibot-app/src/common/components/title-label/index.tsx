import React from 'react';
import styles from './style.css';

interface Props {
  children: React.ReactNode | string;
}

export function TitleLabel({ children }: Props) {
  return <div className={styles.title}>{children}</div>;
}
