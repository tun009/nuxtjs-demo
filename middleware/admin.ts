export default defineNuxtRouteMiddleware((to, from) => {
  const { currentUser, isAdmin } = useAuth();
  
  // Kiểm tra nếu người dùng đã đăng nhập và là admin
  if (!currentUser.value || currentUser.value.role !== 'admin') {
    // Redirect về trang login với thông báo
    return navigateTo('/auth/login?message=You must be an admin to access this page&redirect=' + to.fullPath);
  }
});

// Composable để quản lý authentication
function useAuth() {
  // Giả lập dữ liệu người dùng
  const currentUser = useState('currentUser', () => {
    // Kiểm tra localStorage nếu ở client-side
    if (process.client) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  // Đăng nhập
  const login = (email: string, password: string) => {
    // Giả lập kiểm tra đăng nhập
    if (email === 'admin@example.com' && password === 'admin') {
      const user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };
      
      currentUser.value = user;
      
      // Lưu vào localStorage
      if (process.client) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      return true;
    } else if (email === 'user@example.com' && password === 'user') {
      const user = {
        id: 2,
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user'
      };
      
      currentUser.value = user;
      
      // Lưu vào localStorage
      if (process.client) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      return true;
    } else if (email === 'ocr_admin' && password === '123456aA@') {
      // Thêm tài khoản demo từ API
      const user = {
        id: 1,
        name: 'OCR Admin',
        email: 'ocr_admin',
        role: 'admin',
        branch: {
          id: 217,
          name: 'Hội sở chính',
          code: '1'
        },
        status: 'ACTIVE',
        firstLogin: false
      };
      
      currentUser.value = user;
      
      // Lưu vào localStorage
      if (process.client) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      return true;
    }
    
    return false;
  };

  // Đăng xuất
  const logout = () => {
    currentUser.value = null;
    
    // Xóa khỏi localStorage
    if (process.client) {
      localStorage.removeItem('currentUser');
    }
  };

  // Kiểm tra nếu người dùng là admin
  const isAdmin = computed(() => {
    return currentUser.value?.role === 'admin';
  });

  return {
    currentUser,
    login,
    logout,
    isAdmin
  };
}

// Export composable để sử dụng ở các component khác
export { useAuth }; 