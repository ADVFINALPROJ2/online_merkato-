import api from "./api";

export const deliveryService = {
  async getMyDeliveries(userId: string) {
    const res = await api.get(`/driver/deliveries/${userId}`);
    return res.data;
  },

  async markAsDelivered(deliveryId: string) {
    const res = await api.patch(`/driver/deliveries/${deliveryId}/complete`);
    return res.data;
  },

  async getDriverProfile(userId: string) {
    const res = await api.get(`/driver/profile/${userId}`);
    return res.data;
  },
  
};
