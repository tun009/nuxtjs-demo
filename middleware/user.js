import { useUserStore } from "~/stores/user";
import { ROUTES, WHITELIST_ROUTES } from "~/utils/constants";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Kiểm tra xem route có nằm trong whitelist không
  // Sử dụng to.fullPath thay vì to.path để xử lý cả query params
  const path = to.path;
  const isWhitelisted =
    WHITELIST_ROUTES.includes(path) ||
    path.startsWith("/products/") ||
    path.startsWith("/api/");

  console.log(
    `User middleware checking route: ${path}, whitelisted: ${isWhitelisted}`
  );

  // Nếu route nằm trong whitelist, cho phép truy cập mà không cần kiểm tra
  if (isWhitelisted) {
    console.log(`Route ${path} is whitelisted, skipping auth check`);
    return;
  }

  // Sử dụng store
  const userStore = useUserStore();

  // Kiểm tra xác thực
  let isAuthenticated = userStore.isAuthenticated;

  // Kiểm tra token trong localStorage nếu store chưa có
  if (!isAuthenticated && process.client) {
    const token = localStorage.getItem("access_token");
    console.log("Checking token in localStorage:", token);
    if (token) {
      userStore.setToken(token);
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) {
    console.log("User is not authenticated, redirecting to login");
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return navigateTo({
      path: ROUTES.LOGIN,
      query: {
        redirect: to.fullPath,
        message: "Vui lòng đăng nhập để tiếp tục",
      },
    });
  }

  // Nếu chưa có thông tin người dùng, lấy thông tin
  if (!userStore.user) {
    try {
      await userStore.fetchUserInfo();
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Nếu có lỗi, đăng xuất và chuyển hướng đến trang đăng nhập
      userStore.logout();
      return navigateTo({
        path: ROUTES.LOGIN,
        query: {
          redirect: to.fullPath,
          message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
        },
      });
    }
  }

  // Kiểm tra quyền user hoặc admin (admin cũng có thể truy cập trang user)
  if (!userStore.isUser && !userStore.isAdmin) {
    // Nếu không phải user hoặc admin, chuyển hướng đến trang 403
    return navigateTo({
      path: ROUTES.FORBIDDEN,
      query: {
        message: "Bạn không có quyền truy cập trang này",
      },
    });
  }
});
