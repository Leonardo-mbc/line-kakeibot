export interface Receipt {
  boughtAt: string;
  excludedPrices: ExcludedPrice[] | undefined;
  imageUrl: string;
  place: string;
  price: number;
  who: string;
}

export interface ExcludedPrice {
  label: string;
  price: number;
}
