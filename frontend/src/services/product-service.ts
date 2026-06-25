import api from './api';
import type { Product, CreateProductDto, UpdateProductDto, DeleteProductResponse } from '@/types/product';

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get<Product[]>('/products/my');
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  async create(dto: CreateProductDto): Promise<Product> {
    const { data } = await api.post<Product>('/products', dto);
    return data;
  },

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const { data } = await api.patch<Product>(`/products/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<DeleteProductResponse> {
    const { data } = await api.delete<DeleteProductResponse>(`/products/${id}`);
    return data;
  },

  async updateStatus(id: string, status: string): Promise<Product> {
    const { data } = await api.patch<Product>(`/products/${id}/status`, { status });
    return data;
  },
};
