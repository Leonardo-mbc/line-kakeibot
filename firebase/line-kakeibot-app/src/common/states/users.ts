import { atom } from 'recoil';

export const userIdState = atom({
  key: 'atom:userId',
  default: '',
});
