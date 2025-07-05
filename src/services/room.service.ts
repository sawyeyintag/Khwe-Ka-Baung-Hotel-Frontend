import { apiService, ResponseData } from "@/plugins/axios";
import {
  Room,
  RoomCreate,
  RoomSearchParams,
  RoomUpdate,
} from "@/types/room.type";

export const roomService = {
  async getAll(params: RoomSearchParams = {}) {
    const response: ResponseData<Room[]> = await apiService.get("/rooms", {
      params,
    });
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
