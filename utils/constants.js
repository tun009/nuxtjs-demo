export const API_CONFIG_USER = {
  CLIENT_ID: 11,
  CLIENT_SECRET: "HVEvx4b0aOoFi8Y4WlqPRbf2aJj4PwVZORtzfK1S",
};
export const API_CONFIG_ADMIN = {
  CLIENT_ID: 13,
  CLIENT_SECRET: "cLs1SFG55Y0pMQjqMUfBcDguVl8ZXsScWl2JqNdJ",
  STATE: "FMhplpHiIKEtoupJoBxSKB7C27jaepKALAfQeRQ",
};
export const ENDPOINTS = {
  LOGIN: "/oauth/token",
  USER_INFO: "/api/user/me",
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
};

// Route Constants
export const ROUTES = {
  LOGIN: "/auth/login",
  HOME: "/",
  ADMIN_HOME: "/admin",
  USER_HOME: "/user",
  FORBIDDEN: "/403",
  NOT_FOUND: "/404",
};

// Whitelist Routes (không cần đăng nhập)
export const WHITELIST_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.HOME,
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/callback",
  "/products",
  "/products/detail",
  ROUTES.FORBIDDEN,
  ROUTES.NOT_FOUND,
];
