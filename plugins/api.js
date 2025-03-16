import axios from "axios";
import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  console.log("API plugin initialized with base URL:", apiBaseUrl);

  // Tạo instance axios
  const api = axios.create({
    baseURL: apiBaseUrl,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Interceptor cho request
  api.interceptors.request.use(
    (config) => {
      // Thêm token vào header nếu có
      let token = null;
      if (process.client) {
        token = localStorage.getItem("access_token");
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Adding auth token to request:", config.url);
      } else {
        console.log("No auth token available for request:", config.url);
      }
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Interceptor cho response
  api.interceptors.response.use(
    (response) => {
      // Trả về dữ liệu từ response
      console.log("API response success:", response.config.url);
      return response.data;
    },
    async (error) => {
      console.error(
        "API response error:",
        error.config?.url,
        error.response?.status,
        error.message
      );

      const originalRequest = error.config;

      // Xử lý lỗi 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log("Attempting to refresh token for 401 error");
        originalRequest._retry = true;

        try {
          // Thử refresh token
          const userStore = useUserStore();
          if (userStore && userStore.refreshToken) {
            console.log("Refreshing token...");
            const refreshed = await userStore.refreshToken();
            if (refreshed) {
              // Nếu refresh thành công, thử lại request ban đầu
              console.log("Token refreshed successfully, retrying request");
              let token = null;
              if (process.client) {
                token = localStorage.getItem("access_token");
              }
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
              }
            } else {
              console.log("Token refresh failed");
            }
          } else {
            console.log("No refresh token available");
          }

          // Nếu không refresh được, chuyển hướng đến trang đăng nhập
          console.log("Redirecting to login page");
          navigateTo("/auth/login");
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          navigateTo("/auth/login");
        }
      }

      return Promise.reject(error);
    }
  );

  // Cung cấp các phương thức API
  const apiService = {
    get: (endpoint, config) => api.get(endpoint, config),
    post: (endpoint, data, config) => api.post(endpoint, data, config),
    put: (endpoint, data, config) => api.put(endpoint, data, config),
    delete: (endpoint, config) => api.delete(endpoint, config),
    patch: (endpoint, data, config) => api.patch(endpoint, data, config),
  };

  // Cung cấp API service cho ứng dụng
  nuxtApp.provide("api", apiService);
});
