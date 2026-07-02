import api from "./api";

export const orderService = {
  async getMyOrders() {
    const res = await api.get("/orders");
    return res.data;
  },

  async getOrderById(id: string) {
    const res = await api.get(`/orders`);
    return res.data;
  },
};