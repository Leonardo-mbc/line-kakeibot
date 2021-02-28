import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './style.css';
import { InnerElements } from 'src/common/types';

interface Props {
  isShow: boolean;
  children: InnerElements;
}
export function ConfirmPanel({ children, isShow }: Props) {
  const [isHide, setIsHide] = useState(true);

  useEffect(() => {
    if (isShow) {
      setIsHide(false);
    }
  }, [isShow]);

  function handleTransitionEnd() {
    if (!isShow) {
      setIsHide(true);
    }
  }

  return isHide ? null : (
    <div
      className={clsx(styles.confirmContainer, {
        [styles.transparent]: !isShow,
      })}
      onTransitionEnd={handleTransitionEnd}>
      <div className={styles.confirm} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

interface ConfirmPanelTitleProps {
  children: InnerElements;
}
export function ConfirmPanelTitle({ children }: ConfirmPanelTitleProps) {
  return <div className={styles.panelTitle}>{children}</div>;
}

interface ConfirmPanelResponsesProps {
  children: InnerElements;
}
export function ConfirmPanelResponses({ children }: ConfirmPanelResponsesProps) {
  return <div className={styles.outAnswers}>{children}</div>;
}

interface ConfirmPanelButtonProps {
  type?: 'submit' | 'cancel';
  onClick?: () => void;
  children: InnerElements;
}
export function ConfirmPanelButton({
  type = 'submit',
  onClick,
  children,
}: ConfirmPanelButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (onClick) {
      onClick();
    }
  }

  return (
    <span
      className={clsx(styles.outButton, {
        [styles.yes]: type === 'submit',
        [styles.cancel]: type === 'cancel',
      })}
      onClick={(e) => handleClick(e)}>
      {children}
    </span>
  );
}
