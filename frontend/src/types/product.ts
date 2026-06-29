export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' | 'DRAFT';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  status: ProductStatus;
  images: string[];
  imageUrl: string | null;
  shopId: string;
  categoryId: string | null;
  category: { id: string; name: string } | null;
  shop?: { id: string; name: string; logoUrl?: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  status?: ProductStatus;
  images?: string[];
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  status?: ProductStatus;
  images?: string[];
  categoryId?: string;
}

export interface DeleteProductResponse {
  message: string;
}
