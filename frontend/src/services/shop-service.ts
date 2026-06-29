import api from './api';
import type {
  Shop,
  ShopDashboardData,
  CreateShopDto,
  UpdateShopDto,
  ShopLocationDto,
  CreateShopResponse,
} from '@/types/shop';

export const shopService = {
  async create(dto: CreateShopDto): Promise<CreateShopResponse> {
    const { data } = await api.post<CreateShopResponse>('/shops', dto);
    return data;
  },

  async update(dto: UpdateShopDto): Promise<Shop> {
    const { data } = await api.patch<Shop>('/shops', dto);
    return data;
  },

  async setLocation(dto: ShopLocationDto) {
    const { data } = await api.post('/shops/location', dto);
    return data;
  },

  async getMyShop(): Promise<Shop> {
    const { data } = await api.get<Shop>('/shops/my');
    return data;
  },

  async getDashboard(): Promise<ShopDashboardData> {
    const { data } = await api.get<ShopDashboardData>('/shops/dashboard');
    return data;
  },
};
