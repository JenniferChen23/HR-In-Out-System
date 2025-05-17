import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

// 在每次發 request 前，自動加入 Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
