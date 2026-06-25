import api from './api';
import type { Category, CategoryTreeNode, CreateCategoryDto, UpdateCategoryDto } from '@/types/category';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },

  async getTree(): Promise<CategoryTreeNode[]> {
    const { data } = await api.get<CategoryTreeNode[]>('/categories?tree=true');
    return data;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  async create(dto: CreateCategoryDto): Promise<Category> {
    const { data } = await api.post<Category>('/categories', dto);
    return data;
  },

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const { data } = await api.patch<Category>(`/categories/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/categories/${id}`);
    return data;
  },
};
