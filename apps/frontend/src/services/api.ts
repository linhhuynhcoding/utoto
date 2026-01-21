import axios from "axios";
import envConfig from "@/config";

const api = axios.create({
  baseURL: envConfig.API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
