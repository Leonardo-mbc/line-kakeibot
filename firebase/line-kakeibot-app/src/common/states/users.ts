import { atom } from 'recoil';

export type User = string;

export interface Users {
  [key: string]: User;
}

export const userIdState = atom({
  key: 'atom:userId',
  default: '',
});
