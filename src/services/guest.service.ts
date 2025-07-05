import { apiService, ResponseData } from "@/plugins/axios";
import { Guest, GuestFormData } from "@/types/guest.type";

export const guestService = {
  async getAll() {
    const response: ResponseData<Guest[]> = await apiService.get("/guests");
    return response.data.data;
  },
  async getById(uid: string) {
    const response: ResponseData<Guest> = await apiService.get(
      `/guests/${uid}`
    );
    return response.data.data;
  },
  async getGuestByNicCardNum(nicCardNum: string) {
    const response: ResponseData<Guest> = await apiService.get(
      `/guests/nic-card/${nicCardNum}`
    );
    return response.data.data;
  },
  async create(data: GuestFormData) {
    const response: ResponseData<Guest> = await apiService.post(
      "/guests",
      data
    );
    return response.data.data;
  },
  async update(uid: string, data: GuestFormData) {
    const response: ResponseData<Guest> = await apiService.put(
      `/guests/${uid}`,
      data
    );
    return response.data.data;
  },
  async delete(uid: string) {
    await apiService.delete(`/guests/${uid}`);
  },
};
