import { apiService, ResponseData } from "@/plugins/axios";
import { Room, RoomCreate, RoomUpdate } from "@/types/room.type";

export const roomService = {
  async getAll() {
    const response: ResponseData<Room[]> = await apiService.get("/rooms");
    return response.data.data;
  },
  async getById(roomNumber: string) {
    const response: ResponseData<Room> = await apiService.get(
      `/rooms/${roomNumber}`
    );
    return response.data.data;
  },
  async create(data: RoomCreate) {
    const response: ResponseData<Room> = await apiService.post("/rooms", data);
    return response.data.data;
  },
  async update(roomNumber: string, data: RoomUpdate) {
    const response: ResponseData<Room> = await apiService.put(
      `/rooms/${roomNumber}`,
      data
    );
    return response.data.data;
  },
  async delete(roomNumber: string) {
    const response: ResponseData<Room> = await apiService.delete(
      `/rooms/${roomNumber}`
    );
    return response.data.data;
  },
};
