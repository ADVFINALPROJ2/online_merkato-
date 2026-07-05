import api from "./api";

export const orderService = {
  async getMyOrders() {
    const res = await api.get("/order/history");
    return res.data;
  },

  async createOrder(data: any) {
    const res = await api.post("/order", data);
    return res.data;
  },

  async getOrderById(id: string) {
    const res = await api.get(`/order/${id}`);
    return res.data;
  },
};