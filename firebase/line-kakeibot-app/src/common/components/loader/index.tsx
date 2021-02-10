import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './style.css';

interface Props {
  isShow?: boolean;
}

export function Loader({ isShow }: Props) {
  return <div className={clsx(styles.loader, { [styles.transparent]: !isShow })} />;
}
