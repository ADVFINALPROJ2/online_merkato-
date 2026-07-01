import api from './api';

export interface BrowseParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchParams extends BrowseParams {
  q?: string;
  categoryId?: string;
}

export const buyerService = {
  async browseProducts(params?: BrowseParams) {
    const { data } = await api.get('/buyer/products', { params });
    return data;
  },
  async getProductDetail(id: string) {
    const { data } = await api.get(`/buyer/products/${id}`);
    return data;
  },
  async getCategories() {
    const { data } = await api.get('/buyer/categories');
    return data;
  },
  async browseByCategory(categoryId: string, params?: BrowseParams) {
    const { data } = await api.get(`/buyer/categories/${categoryId}/products`, { params });
    return data;
  },
  async getShopInfo(shopId: string) {
    const { data } = await api.get(`/buyer/shops/${shopId}`);
    return data;
  },
  async browseByShop(shopId: string, params?: BrowseParams) {
    const { data } = await api.get(`/buyer/shops/${shopId}/products`, { params });
    return data;
  },
  async search(params: SearchParams) {
    const { data } = await api.get('/buyer/search', { params });
    return data;
  },
  async getSuggestions(q: string) {
    const { data } = await api.get('/buyer/search/suggestions', { params: { q } });
    return data;
  },
  async getRelatedProducts(productId: string) {
    const { data } = await api.get(`/buyer/products/${productId}/related`);
    return data;
  },
  async getTrending() {
    const { data } = await api.get('/buyer/trending');
    return data;
  },
};