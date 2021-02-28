import { atom } from 'recoil';

export const showGroupSettingState = atom({
  key: 'atom:showGroupSettingState',
  default: false,
});

export const selectedGroupIdState = atom({
  key: 'atom:selectedGroupIdState',
  default: '',
});
