import axios from "axios";
import type { AxiosResponse } from "axios";

// import { getCookie } from "typescript-cookie";

const baseURL = import.meta.env.VITE_API_URL;

export interface ResponseData<T> extends AxiosResponse {
  data: {
    data: T;
  };
}

const apiService = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token dynamically for requests that need it
// apiService.interceptors.request.use(
//   (config) => {
//     const token = getCookie("token");
//     if (token && config.headers.requiresAuth) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     delete config.headers.requiresAuth; // Remove the custom header property before sending the request
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export { apiService };
