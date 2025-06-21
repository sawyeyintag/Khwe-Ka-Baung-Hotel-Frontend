import { apiService, ResponseData } from "@/plugins/axios";
import { RoomType } from "@/types/room-type.type";

export const roomTypeService = {
  async getAll() {
    const response: ResponseData<RoomType[]> =
      await apiService.get("/room-types");

    return response.data.data;
  },
};
