import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Thêm header này để bypass màn hình cảnh báo của ngrok nếu dùng ngrok
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});

export default axiosClient;
