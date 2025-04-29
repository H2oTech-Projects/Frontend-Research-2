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
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Let valid responses pass through
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized: Token expired or invalid, logging out...");
      localStorage.removeItem("auth");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
