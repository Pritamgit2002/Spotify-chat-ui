import axios, { AxiosError, AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};
    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request error*((()))]", error);

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.log("[API Response error]", error?.response?.data);

    return Promise.reject(error?.response?.data);
  }
);

export { api };
