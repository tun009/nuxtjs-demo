// Cung cấp các hằng số cấu hình
export default defineNuxtPlugin((nuxtApp) => {
  const { API_CONFIG_USER, API_CONFIG_ADMIN } = useRuntimeConfig().public;

  nuxtApp.provide("apiConfig", {
    API_CONFIG_USER,
    API_CONFIG_ADMIN,
  });
});
