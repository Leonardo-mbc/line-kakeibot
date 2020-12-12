import { User } from './users';

export interface Receipt {
  boughtAt: string;
  imageUrl: string;
  place: string;
  price: number;
  who: User;
}

export interface GroupReceipts {
  [key: string]: Receipt;
}

export interface Receipts {
  [key: string]: GroupReceipts;
}
