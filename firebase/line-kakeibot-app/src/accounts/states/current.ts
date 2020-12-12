import { atom, selector } from 'recoil';
import dayjs from 'dayjs';

const now = dayjs();

interface CurrentState {
  groupId: string;
  target: string;
}

export const currentTargetState = atom({
  key: 'atom:currentTarget',
  default: now.format('YYYY-MM'),
});

export const selectedGroupIdState = atom({
  key: 'atom:selectedGroupId',
  default: '',
});

export const selectedPaymentState = atom({
  key: 'atom:selectedPayment',
  default: '',
});

export const currentMonthLabel = selector({
  key: 'selector:currentMonthLabel',
  get: ({ get }) => `${get(currentTargetState).split('-')[1]}月`,
});
