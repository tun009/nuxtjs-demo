import axios from "axios";
import { useToast } from "~/composables/useToast";
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl;

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-CSRF-TOKEN": "",
  },
});

// Interceptor để xử lý request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useCookie("access_token").value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý unauthorized
      const token = useCookie("access_token");
      const refreshToken = useCookie("refresh_token");
      token.value = null;
      refreshToken.value = null;

      // Redirect to login
      const router = useRouter();
      router.push("/auth/login");
    }
    return Promise.reject(error);
  }
);

// API Service
export const apiService = {
  get: (endpoint, config) => axiosInstance.get(endpoint, config),
  post: (endpoint, data, config) => axiosInstance.post(endpoint, data, config),
  put: (endpoint, data, config) => axiosInstance.put(endpoint, data, config),
  delete: (endpoint, config) => axiosInstance.delete(endpoint, config),
  patch: (endpoint, data, config) =>
    axiosInstance.patch(endpoint, data, config),
};

// Composable wrapper
export const useApiService = () => {
  return apiService;
};
