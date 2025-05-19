import { apiService, ResponseData } from "@/plugins/axios";
import { GuestUpsert, Guest } from "@/features/guests/data/schema";

export const guestService = {
  async getGuestList() {
    const response: ResponseData<Guest[]> = await apiService.get("/guests");
    return response.data.data;
  },
  async getGuestById(id: string) {
    const response: ResponseData<Guest> = await apiService.get(`/guests/${id}`);
    return response.data.data;
  },
  async createGuest(data: GuestUpsert) {
    const response: ResponseData<Guest> = await apiService.post(
      "/guests",
      data
    );
    return response.data.data;
  },
  async updateGuest(id: string, data: GuestUpsert) {
    const response: ResponseData<Guest> = await apiService.put(
      `/guests/${id}`,
      data
    );
    return response.data.data;
  },
  async deleteGuest(id: string) {
    await apiService.delete(`/guests/${id}`);
  },
};
