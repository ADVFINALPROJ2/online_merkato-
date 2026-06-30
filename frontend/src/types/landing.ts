export interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
}

export interface FlashDeal extends Product {
  endTime: Date;
}