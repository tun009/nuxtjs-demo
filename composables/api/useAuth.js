import { useCookie } from "nuxt/app";
import { useApiService } from "./useApiService";
import { API_CONFIG_USER, ENDPOINTS } from "~/utils/constants";

export const useAuthApi = () => {
  const api = useApiService();

  // Token cookies
  const tokenCookie = useCookie("access_token");
  const refreshTokenCookie = useCookie("refresh_token", {
    maxAge: 30 * 24 * 60 * 60,
  });

  // User state
  const currentUser = useState("currentUser", () => null);
  const isAuthenticated = computed(() => !!tokenCookie.value);
  const isAdmin = computed(() => currentUser.value?.role === "admin");

  // Login function
  const login = async (username, password, authCodeData = null) => {
    try {
      let requestData;

      if (authCodeData) {
        // Login with authorization code
        requestData = authCodeData;
      } else {
        // Login with password
        requestData = {
          grant_type: "password",
          client_id: API_CONFIG_USER.CLIENT_ID,
          client_secret: API_CONFIG_USER.CLIENT_SECRET,
          username,
          password,
        };
      }
      const response = await api.post(ENDPOINTS.LOGIN, requestData);
      if (response.access_token) {
        // Save tokens to cookies with proper expiration
        tokenCookie.value = response.access_token;
        // Set maxAge based on expires_in from response
        tokenCookie.maxAge = response.expires_in;
        refreshTokenCookie.value = response.refresh_token;

        // Get user info
        await fetchUserInfo();

        return {
          success: true,
          message: "Login successful",
        };
      } else {
        return {
          success: false,
          message: response.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  };

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      if (!tokenCookie.value) {
        return null;
      }

      const response = await api.get("api/user/me");

      if (response.success && response.data) {
        currentUser.value = response.data?.user;
        return currentUser.value;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user info:", error);
      logout();
      return null;
    }
  };

  // Logout function
  const logout = () => {
    // Clear cookies
    tokenCookie.value = null;
    refreshTokenCookie.value = null;

    // Clear user state
    currentUser.value = null;
  };

  // Check auth on app init
  const initAuth = async () => {
    if (tokenCookie.value) {
      await fetchUserInfo();
    }
  };

  return {
    login,
    logout,
    fetchUserInfo,
    initAuth,
    currentUser,
    isAuthenticated,
    isAdmin,
    getToken: () => tokenCookie.value,
    getRefreshToken: () => refreshTokenCookie.value,
  };
};
