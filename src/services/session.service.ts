import { apiService, ResponseData } from "@/plugins/axios";
import {
  Session,
  SessionCreateFormInput,
  SessionEndFormInput,
} from "@/types/session.type";

export const sessionService = {
  async getAll() {
    const response: ResponseData<Session[]> = await apiService.get("/sessions");
    return response.data.data;
  },
  async getById(sessionId: string) {
    const response: ResponseData<Session> = await apiService.get(
      `/sessions/${sessionId}`
    );
    return response.data.data;
  },
  async create(data: SessionCreateFormInput) {
    const response: ResponseData<Session> = await apiService.post(
      "/sessions",
      data
    );
    return response.data.data;
  },

  async end(sessionId: number, data: SessionEndFormInput) {
    const response: ResponseData<Session> = await apiService.patch(
      `/sessions/${sessionId}`,
      data
    );
    return response.data.data;
  },

  async delete(sessionId: string) {
    const response: ResponseData<Session> = await apiService.delete(
      `/sessions/${sessionId}`
    );
    return response.data.data;
  },
};
