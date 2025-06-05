import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token from cookies
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
      toast.warn("Unauthorized: Token expired or invalid, logging out...");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;