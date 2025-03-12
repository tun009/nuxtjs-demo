import { defineNuxtPlugin } from 'nuxt/app';
import { useAuth } from '~/middleware/admin';

export default defineNuxtPlugin((nuxtApp) => {
  const { logout } = useAuth();
  
  // Tạo một hàm wrapper cho $fetch
  const apiFetch = async (url: string, options: any = {}) => {
    // Lấy token từ cookie
    const token = useCookie('auth_token').value;
    
    // Thêm headers mặc định
    options.headers = {
      ...options.headers,
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    };
    
    // Thêm token vào header nếu có
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    try {
      // Sử dụng $fetch toàn cục
      return await $fetch(url, options);
    } catch (error: any) {
      // Xử lý lỗi
      console.error('API error:', error);
      
      // Xử lý lỗi 401 Unauthorized
      if (error.response?.status === 401) {
        // Token hết hạn, đăng xuất
        logout();
        navigateTo('/auth/login?message=Your session has expired. Please login again.');
      }
      
      throw error;
    }
  };
  
  // Đăng ký plugin
  nuxtApp.provide('api', apiFetch);
}); 