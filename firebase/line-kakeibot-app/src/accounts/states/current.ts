import { atom, selector } from 'recoil';
import dayjs from 'dayjs';
import { receiptsState } from './receipts';
import { formatMonthRange } from '../utilities/month-range';

const now = dayjs();

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

export const currentMonthStartDayState = selector({
  key: 'selector:currentMonthStartDay',
  get: ({ get }) => {
    const { groups } = get(receiptsState);
    const selectedGroupId = get(selectedGroupIdState);
    
    if (groups[selectedGroupId]) {
      return groups[selectedGroupId].monthStartDay || 1;
    }
    return 1;
  },
});

export const currentMonthRangeLabel = selector({
  key: 'selector:currentMonthRangeLabel',
  get: ({ get }) => {
    const currentTarget = get(currentTargetState);
    const monthStartDay = get(currentMonthStartDayState);
    
    return formatMonthRange(currentTarget, monthStartDay);
  },
});
