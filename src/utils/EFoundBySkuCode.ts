import { Stock } from '../dto/StockDTO';

export const eFindBySkuCode = (skuCode: string, items: Stock[]) => {
  const item = items.find((item) => item.skuCode === skuCode);

  return item ?? null;
};
