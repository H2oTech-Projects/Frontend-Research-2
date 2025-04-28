import axios from "axios";


const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization token globally
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth")? JSON.parse(localStorage.getItem("auth") || "null")?.access_token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
