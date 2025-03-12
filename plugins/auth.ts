export default defineNuxtPlugin((nuxtApp) => {
  // Tạo đối tượng auth với các phương thức cần thiết
  const auth = {
    // Phương thức đăng nhập
    login: (email: string, password: string) => {
      // Đây là mã giả, bạn cần thay thế bằng logic xác thực thực tế
      // Trong thực tế, bạn sẽ gọi API để xác thực
      return new Promise((resolve, reject) => {
        // Giả lập API call
        setTimeout(() => {
          // Kiểm tra thông tin đăng nhập (mã giả)
          if (email === 'user@example.com' && password === 'password') {
            // Tạo đối tượng user
            const user = {
              id: '1',
              email: email,
              name: 'User Example',
              role: 'user'
            };
            
            // Lưu thông tin user vào localStorage
            if (process.client) {
              localStorage.setItem('user', JSON.stringify(user));
            }
            
            resolve(user);
          } else if (email === 'admin@example.com' && password === 'admin') {
            // Tạo đối tượng admin
            const admin = {
              id: '2',
              email: email,
              name: 'Admin Example',
              role: 'admin'
            };
            
            // Lưu thông tin admin vào localStorage
            if (process.client) {
              localStorage.setItem('user', JSON.stringify(admin));
            }
            
            resolve(admin);
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 500);
      });
    },
    
    // Phương thức đăng xuất
    logout: () => {
      // Xóa thông tin user khỏi localStorage
      if (process.client) {
        localStorage.removeItem('user');
      }
      
      // Chuyển hướng về trang chủ
      return navigateTo('/');
    },
    
    // Phương thức kiểm tra trạng thái đăng nhập
    isAuthenticated: () => {
      if (process.client) {
        return localStorage.getItem('user') !== null;
      }
      return false;
    },
    
    // Phương thức lấy thông tin user hiện tại
    getCurrentUser: () => {
      if (process.client) {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            return JSON.parse(user);
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    },
    
    // Phương thức kiểm tra quyền admin
    isAdmin: () => {
      if (process.client) {
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userData = JSON.parse(user);
            return userData.role === 'admin';
          } catch (e) {
            return false;
          }
        }
      }
      return false;
    }
  };
  
  // Đăng ký plugin
  nuxtApp.provide('auth', auth);
}); 