import { useAuth } from '~/middleware/admin';

export default defineNuxtRouteMiddleware((to, from) => {
  const { currentUser } = useAuth();
  
  // Kiểm tra nếu người dùng đã đăng nhập
  if (!currentUser.value) {
    // Redirect về trang login với thông báo
    return navigateTo('/auth/login?message=You must be logged in to access this page&redirect=' + to.fullPath);
  }
}); 