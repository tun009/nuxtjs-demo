import { useAuth } from '~/middleware/admin';

export default defineNuxtPlugin((nuxtApp) => {
  // Lấy thông tin từ useAuth
  const { currentUser, isAdmin } = useAuth();
  
  // Thêm $auth vào nuxtApp để có thể truy cập từ bất kỳ đâu
  nuxtApp.provide('auth', {
    getCurrentUser: () => currentUser.value,
    isAdmin: () => isAdmin.value
  });
}); 