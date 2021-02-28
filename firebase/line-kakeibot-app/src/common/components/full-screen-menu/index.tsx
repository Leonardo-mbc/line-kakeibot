import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './style.css';
import { InnerElements } from '../../../common/types';

interface FullScreenMenuProps {
  children: InnerElements;
  isShow: boolean;
  onHide?: () => void;
}
export function FullScreenMenu({ children, isShow, onHide }: FullScreenMenuProps) {
  const [isShowMenu, setIsShowMenu] = useState(false);

  function hideMenu() {
    setIsShowMenu(false);
  }

  function handleTransitionEnd() {
    if (!isShowMenu && onHide) {
      onHide();
    }
  }

  useEffect(() => {
    setIsShowMenu(!!isShow);
  }, [isShow]);

  return (
    <div
      className={clsx(styles.container, { [styles.hide]: !isShowMenu })}
      onClick={hideMenu}
      onTransitionEnd={handleTransitionEnd}>
      {children}
    </div>
  );
}

interface MenuListProps {
  children: InnerElements;
}
export function MenuList({ children }: MenuListProps) {
  return <div className={styles.menuListContainer}>{children}</div>;
}

interface MenuItemProps {
  type?: 'default' | 'transparent' | 'warning';
  onClick?: () => void;
  children: InnerElements;
}
export function MenuItem({ type = 'default', children, onClick }: MenuItemProps) {
  function handleClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  }

  return (
    <span
      className={clsx(styles.menuItem, {
        [styles.cancel]: type === 'transparent',
        [styles.delete]: type === 'warning',
      })}
      onClick={(e) => handleClick(e)}>
      {children}
    </span>
  );
}
