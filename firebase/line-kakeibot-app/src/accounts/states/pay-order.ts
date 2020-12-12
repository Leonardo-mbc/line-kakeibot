import { atom } from 'recoil';

interface PayOrder {
  from: string;
  to: string;
  pay: number;
}

export const payOrdersState = atom<PayOrder[]>({
  key: 'atom:payOrders',
  default: [],
});
