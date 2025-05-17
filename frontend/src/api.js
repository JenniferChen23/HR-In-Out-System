import axios from "axios";

const api = axios.create({
  baseURL: "/", // 開發環境靠 proxy，正式環境可能改成真實 API 網址
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
