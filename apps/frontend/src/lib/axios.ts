import axios from "axios";
import envConfig from "@/config";
import { StorageKeys } from "@/contexts/StorageContext";

const apiClient = axios.create({
  baseURL: envConfig.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
    if (token) {
      // The token is stored as a JSON string with quotes, so we need to parse it or remove quotes
      // Based on StorageContext, it seems to be stored as just the string value but let's double check usage
      // Actually StorageContext generic setItem uses JSON.stringify.
      // So if token is "abc", safe retrieval might need parsing if it was stringified.
      // Let's assume standard behavior first: if it's a bare string in local storage, use it.
      // But StorageContext says: localStorage.setItem(key, JSON.stringify(value))
      // So if token string is 'xyz', it is stored as '"xyz"'.
      // We need to parse it if it looks like a JSON string.
      try {
        const parsedToken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor removed to keep types consistent with AxiosResponse

export default apiClient;
