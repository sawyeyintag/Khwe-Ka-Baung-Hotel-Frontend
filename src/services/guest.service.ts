import { apiService, ResponseData } from "@/plugins/axios";
import { GuestUpsert, Guest } from "@/features/guests/data/schema";

export const guestService = {
  async getAll() {
    const response: ResponseData<Guest[]> = await apiService.get("/guests");
    return response.data.data;
  },
  async getById(id: string) {
    const response: ResponseData<Guest> = await apiService.get(`/guests/${id}`);
    return response.data.data;
  },
  async create(data: GuestUpsert) {
    const response: ResponseData<Guest> = await apiService.post(
      "/guests",
      data
    );
    return response.data.data;
  },
  async update(id: string, data: GuestUpsert) {
    const response: ResponseData<Guest> = await apiService.put(
      `/guests/${id}`,
      data
    );
    return response.data.data;
  },
  async delete(id: string) {
    await apiService.delete(`/guests/${id}`);
  },
};
