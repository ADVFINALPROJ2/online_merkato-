import api from './api';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  isAvailable: boolean;
  image: string | null;
  shop: { id: string; name: string };
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  total: number;
  hasUnavailableItems: boolean;
  unavailableItemIds: string[];
}

export const cartService = {
  async getCart(): Promise<CartSummary> {
    const { data } = await api.get('/cart');
    return data;
  },
  async addItem(productId: string, quantity: number = 1): Promise<CartSummary> {
    const { data } = await api.post('/cart/items', { productId, quantity });
    return data;
  },
  async updateItem(itemId: string, quantity: number): Promise<CartSummary> {
    const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
    return data;
  },
  async removeItem(itemId: string): Promise<CartSummary> {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data;
  },
  async clearCart(): Promise<CartSummary> {
    const { data } = await api.delete('/cart');
    return data;
  },
};