export interface Stock {
  id: number;
  name: string;
  description: string;
  skuCode: string;
  price: number;
  quantity: number;
  thumbnail: string | null;
  type: string;
  createdAt: string;
  updatedAt: string;
}
