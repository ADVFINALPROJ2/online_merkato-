import api from './api';
import type { Category } from '@/types/category';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },
};
