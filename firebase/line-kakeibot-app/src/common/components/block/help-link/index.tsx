import React from 'react';
import styles from './style.css';

interface Props {
  title: string;
  onClick?: () => void;
}

export function HelpLink({ title, onClick }: Props) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }
  return (
    <span className={styles.helpLink} onClick={handleClick}>
      {title}
    </span>
  );
}
