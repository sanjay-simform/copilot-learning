export type ProductStatus = 'active' | 'draft' | 'archived';

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  description?: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
};
