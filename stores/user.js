import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  API_CONFIG_USER,
  ENDPOINTS,
  API_CONFIG_ADMIN,
} from "~/utils/constants";
export const useUserStore = defineStore("user", () => {
  // State
  const user = ref(null);
  const token = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isUser = computed(() => user.value?.role === "user");
  const userRole = computed(() => user.value?.role || null);

  // Actions
  const setUser = (userData) => {
    user.value = userData;
  };

  const setToken = (tokenValue) => {
    token.value = tokenValue;
  };

  const fetchUserInfo = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Lấy token từ localStorage thay vì cookie
      let accessToken = null;
      if (process.client) {
        accessToken = localStorage.getItem("access_token");
        console.log(
          "Fetching user info with token from localStorage:",
          accessToken
        );
      }

      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Cập nhật token trong store
      setToken(accessToken);

      // Gọi API để lấy thông tin người dùng
      const { $api } = useNuxtApp();
      const response = await $api.get("api/user/me");
      console.log("User info response:", response);

      if (response.success && response.data?.user) {
        // Cập nhật thông tin người dùng
        setUser(response.data.user);
        return user.value;
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      error.value = err.message || "An error occurred";
      // Xóa token và thông tin người dùng nếu có lỗi
      logout();
      return null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (username, password, authCodeData = null) => {
    loading.value = true;
    error.value = null;

    try {
      console.log("Login attempt started...");
      const { $api, $apiConfig } = useNuxtApp();

      // Chuẩn bị dữ liệu đăng nhập
      let loginData;

      if (authCodeData) {
        // Đăng nhập bằng authorization code
        console.log("Using authorization code flow");
        loginData = authCodeData;
      } else {
        // Đăng nhập bằng username/password
        console.log("Using password flow");
        loginData = {
          grant_type: "password",
          client_id: $apiConfig.API_CONFIG_USER.CLIENT_ID,
          client_secret: $apiConfig.API_CONFIG_USER.CLIENT_SECRET,
          username,
          password,
        };
      }

      // Gọi API đăng nhập
      console.log("Calling OAuth token endpoint...");
      const response = await $api.post("oauth/token", loginData);
      console.log("OAuth response received:", response);

      if (response.access_token) {
        console.log("Access token received:", response.access_token);

        // Lưu token vào localStorage thay vì cookie
        if (process.client) {
          localStorage.setItem("access_token", response.access_token);
          console.log(
            "Access token saved to localStorage:",
            localStorage.getItem("access_token")
          );

          // Lưu refresh token vào localStorage nếu có
          if (response.refresh_token) {
            console.log("Refresh token received");
            localStorage.setItem("refresh_token", response.refresh_token);
            console.log(
              "Refresh token saved to localStorage:",
              localStorage.getItem("refresh_token")
            );
          }
        }

        // Cập nhật token trong store
        setToken(response.access_token);

        // Lấy thông tin người dùng
        console.log("Fetching user info...");
        await fetchUserInfo();
        console.log("User info fetched:", user.value);

        return {
          success: true,
          user: user.value,
        };
      } else {
        console.error("No access token in response:", response);
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      error.value = err.message || "Login failed";
      return {
        success: false,
        error: error.value,
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    // Xóa token khỏi localStorage thay vì cookie
    if (process.client) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      console.log("Tokens removed from localStorage");
    }

    // Xóa thông tin người dùng và token trong store
    user.value = null;
    token.value = null;
  };

  const refreshToken = async () => {
    try {
      // Lấy refresh token từ localStorage thay vì cookie
      let refreshTokenValue = null;
      if (process.client) {
        refreshTokenValue = localStorage.getItem("refresh_token");
        console.log(
          "Refreshing token with refresh token from localStorage:",
          refreshTokenValue
        );
      }

      if (!refreshTokenValue) {
        throw new Error("No refresh token found");
      }

      const { $api, $apiConfig } = useNuxtApp();

      // Chuẩn bị dữ liệu refresh token
      const refreshData = {
        grant_type: "refresh_token",
        client_id: $apiConfig.API_CONFIG_USER.CLIENT_ID,
        client_secret: $apiConfig.API_CONFIG_USER.CLIENT_SECRET,
        refresh_token: refreshTokenValue,
      };

      // Gọi API refresh token
      const response = await $api.post("oauth/token", refreshData);
      console.log("Refresh token response:", response);

      if (response.access_token) {
        // Lưu token mới vào localStorage thay vì cookie
        if (process.client) {
          localStorage.setItem("access_token", response.access_token);
          console.log(
            "New access token saved to localStorage:",
            localStorage.getItem("access_token")
          );

          // Lưu refresh token mới vào localStorage nếu có
          if (response.refresh_token) {
            localStorage.setItem("refresh_token", response.refresh_token);
            console.log(
              "New refresh token saved to localStorage:",
              localStorage.getItem("refresh_token")
            );
          }
        }

        // Cập nhật token trong store
        setToken(response.access_token);

        return true;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      error.value = err.message || "Failed to refresh token";
      logout();
      return false;
    }
  };

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    isUser,
    userRole,

    // Actions
    setUser,
    setToken,
    fetchUserInfo,
    login,
    logout,
    refreshToken,
  };
});
