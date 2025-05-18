import { apiService } from "@/plugins/axios";
import { GuestUpsert } from "@/types/guest.type";

export const guestService = {
  async getGuestList() {
    const response = await apiService.get("/guests");
    return response.data;
  },
  async getGuestById(id: string) {
    const response = await apiService.get(`/guests/${id}`);
    return response.data;
  },
  async createGuest(data: GuestUpsert) {
    const response = await apiService.post("/guests", data);
    return response.data;
  },
  async updateGuest(id: string, data: GuestUpsert) {
    const response = await apiService.put(`/guests/${id}`, data);
    return response.data;
  },
  async deleteGuest(id: string) {
    const response = await apiService.delete(`/guests/${id}`);
    return response.data;
  },
};
