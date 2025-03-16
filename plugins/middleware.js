import { WHITELIST_ROUTES } from "~/utils/constants";

export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    "global-auth",
    async (to) => {
      // Middleware này sẽ được áp dụng cho tất cả các route
      // Nhưng chúng ta sẽ để middleware auth.js xử lý logic
      // Middleware này chỉ đảm bảo rằng middleware auth.js được gọi cho tất cả các route

      // Không áp dụng middleware cho các route trong whitelist
      const path = to.path;
      const isWhitelisted =
        WHITELIST_ROUTES.includes(path) ||
        path.startsWith("/products/") ||
        path.startsWith("/api/");

      console.log(
        `Global middleware checking route: ${path}, whitelisted: ${isWhitelisted}`
      );

      if (isWhitelisted) {
        console.log(`Route ${path} is whitelisted, skipping global middleware`);
        return;
      }
    },
    { global: true }
  );
});
