import { useCookie, useRuntimeConfig } from 'nuxt/app';

interface LoginResponse {
  code: number;
  msg: string;
  data: {
    token: string;
    refreshToken: string;
  };
}

interface UserData {
  id: number;
  name: string;
  username: string;
  role: string;
  branch: {
    id: number;
    name: string;
    code: string;
  };
  status: string;
  firstLogin: boolean;
}

interface UserResponse {
  code: number;
  msg: string;
  data: UserData;
}

export const useAuthApi = () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  
  // Token cookies
  const tokenCookie = useCookie('auth_token', { maxAge: 7 * 24 * 60 * 60 });
  const refreshTokenCookie = useCookie('refresh_token', { maxAge: 30 * 24 * 60 * 60 });
  
  // User state
  const currentUser = useState<UserData | null>('currentUser', () => null);
  const isAuthenticated = computed(() => !!tokenCookie.value);
  const isAdmin = computed(() => currentUser.value?.role === 'ADMIN');
  
  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await $fetch<LoginResponse>(`${apiBaseUrl}/users/auth`, {
        method: 'POST',
        body: { username, password },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      
      if (response.code === 200 && response.data) {
        // Save tokens to cookies
        tokenCookie.value = response.data.token;
        refreshTokenCookie.value = response.data.refreshToken;
        
        // Get user info
        await fetchUserInfo();
        
        return {
          success: true,
          message: 'Login successful'
        };
      } else {
        return {
          success: false,
          message: response.msg || 'Login failed'
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  };
  
  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      if (!tokenCookie.value) {
        return null;
      }
      
      const response = await $fetch<UserResponse>(`${apiBaseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenCookie.value}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      
      if (response.code === 200 && response.data) {
        currentUser.value = response.data;
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user info:', error);
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
    getRefreshToken: () => refreshTokenCookie.value
  };
}; 