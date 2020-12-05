import { atom, selector } from 'recoil';

export const priceState = atom({
  key: 'atom:price',
  default: 0,
});

export const formattedPriceState = selector({
  key: 'selector:formattedPrice',
  get: ({ get }) => get(priceState).toLocaleString(),
});
