import { User } from './user';

export interface Receipt {
  boughtAt: string;
  excludedPrices: ExcludedPrice[] | undefined;
  imageUrl: string;
  place: string;
  price: number;
  who: User;
}

export interface ExcludedPrice {
  label: string;
  price: number;
}
