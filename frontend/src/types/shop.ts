export type BusinessType = 'ELECTRONICS' | 'FASHION' | 'FOOD' | 'AGRICULTURE' | 'HOME' | 'OTHER';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface ShopLocation {
  id: string;
  shopId: string;
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  terra: string;
  latitude: number;
  longitude: number;
  landmark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  contactPhone: string | null;
  businessType: string | null;
  verificationStatus: VerificationStatus;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
  };
  location: ShopLocation | null;
}

export interface ShopDashboardData {
  shop: Shop;
  stats: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    totalProductsValue: number;
  };
}

export interface CreateShopDto {
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactPhone?: string;
  businessType?: BusinessType;
}

export interface UpdateShopDto {
  name?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactPhone?: string;
  businessType?: string;
}

export interface ShopLocationDto {
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  terra: string;
  latitude: number;
  longitude: number;
  landmark?: string;
}

export interface CreateShopResponse {
  message: string;
  shop: Shop;
}
