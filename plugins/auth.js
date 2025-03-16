import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin(async (nuxtApp) => {
  // Lấy store từ pinia
  const userStore = useUserStore();

  // Kiểm tra token và lấy thông tin người dùng nếu đã đăng nhập
  const token = useCookie("access_token").value;
  if (token) {
    try {
      await userStore.fetchUserInfo();
    } catch (error) {
      console.error("Failed to get user info on app init:", error);
      userStore.logout();
    }
  }

  // Cung cấp các phương thức xác thực cho ứng dụng
  return {
    provide: {
      auth: {
        isAuthenticated: () => userStore.isAuthenticated,
        isAdmin: () => userStore.isAdmin,
        isUser: () => userStore.isUser,
        getUser: () => userStore.user,
        login: userStore.login,
        logout: userStore.logout,
        refreshToken: userStore.refreshToken,
      },
    },
  };
});
