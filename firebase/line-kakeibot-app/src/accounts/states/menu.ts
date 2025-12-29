import { atom, selector } from 'recoil';
import { selectedPaymentState } from './current';

export const isShowMenuState = atom({
  key: 'atom:isShowMenu',
  default: false,
});

export const isShowDeleteConfirmState = atom({
  key: 'atom:isShowDeleteConfirm',
  default: false,
});

export const isShowMoveConfirmState = atom({
  key: 'atom:isShowMoveConfirm',
  default: false,
});

export const isShowAddExcludedPriceModalState = atom({
  key: 'atom:isShowAddExcludedPriceModalState',
  default: false,
});

export const isDirectShowAddExcludedPriceModalState = atom({
  key: 'atom:isDirectShowAddExcludedPriceModalState',
  default: false,
});

export const isShowSplitViewState = atom({
  key: 'atom:isShowSplitView',
  default: false,
});

export const isShowChangeDateModalState = atom({
  key: 'atom:isShowChangeDateModal',
  default: false,
});

export const hideAllMenuSelector = selector({
  key: 'selector/hideAllMenu',
  get: () => null,
  set: ({ set }) => {
    set(isShowMenuState, false);
    set(isShowDeleteConfirmState, false);
    set(isShowAddExcludedPriceModalState, false);
    set(isDirectShowAddExcludedPriceModalState, false);
    set(isShowMoveConfirmState, false);
    set(isShowChangeDateModalState, false);
    set(selectedPaymentState, '');
  },
});
