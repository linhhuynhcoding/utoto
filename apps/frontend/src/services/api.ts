import axios from "axios";
import envConfig from "@/config";
import { StorageKeys } from "@/contexts/StorageContext";

const api = axios.create({
  baseURL: envConfig.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Standardize error handling if needed
    return Promise.reject(error);
  },
);

export default api;
