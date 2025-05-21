import { apiService, ResponseData } from "@/plugins/axios";
import { Room, RoomUpsert } from "@/features/rooms/data/schema";

export const roomService = {
  async getAll() {
    const response: ResponseData<Room[]> = await apiService.get("/rooms");
    return response.data.data;
  },
  async getById(id: string) {
    const response: ResponseData<Room> = await apiService.get(`/rooms/${id}`);
    return response.data.data;
  },
  async create(data: RoomUpsert) {
    const response: ResponseData<Room> = await apiService.post("/rooms", data);
    return response.data.data;
  },
};
