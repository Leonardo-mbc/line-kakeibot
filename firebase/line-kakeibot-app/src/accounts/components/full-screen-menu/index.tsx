import React from 'react';
import clsx from 'clsx';
import styles from './style.css';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  hideAllMenuSelector,
  isShowDeleteConfirmState,
  isShowMenuState,
  isShowMoveConfirmState,
} from '../../states/menu';

interface Props {
  children: Element | JSX.Element;
}

export function FullScreenMenu({ children }: Props) {
  const isShowMenu = useRecoilValue(isShowMenuState);
  const setIsShowDeleteConfirm = useSetRecoilState(isShowDeleteConfirmState);
  const setIsShowMoveConfirmState = useSetRecoilState(isShowMoveConfirmState);
  const hideAllMenu = useSetRecoilState(hideAllMenuSelector);

  function hideMenu() {
    hideAllMenu(null);
  }

  function moveAccount(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.stopPropagation();
    setIsShowMoveConfirmState(true);
  }

  function deletePayment(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.stopPropagation();
    setIsShowDeleteConfirm(true);
  }

  return (
    <div className={clsx(styles.container, { [styles.hide]: !isShowMenu })} onClick={hideMenu}>
      <div className={styles.menuListContainer}>
        <span className={clsx(styles.menuItem, styles.cancel)}>キャンセル</span>
        <span className={styles.menuItem} onClick={moveAccount}>
          別の家計簿に移行
        </span>
        <span className={clsx(styles.menuItem, styles.delete)} onClick={deletePayment}>
          削除
        </span>
      </div>
      {children}
    </div>
  );
}
