export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp();
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  // Đây là mã giả, bạn cần thay thế bằng logic xác thực thực tế
  const isAuthenticated = () => {
    // Kiểm tra localStorage hoặc cookie để xác định trạng thái đăng nhập
    if (process.client) {
      return localStorage.getItem('user') !== null;
    }
    return false;
  };

  // Nếu người dùng chưa đăng nhập và đang cố truy cập trang user
  if (!isAuthenticated() && to.path.startsWith('/user')) {
    // Chuyển hướng đến trang đăng nhập
    return navigateTo('/auth/login');
  }
}); 