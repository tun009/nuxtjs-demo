export default defineNuxtPlugin((nuxtApp) => {
  const loading = useState("loading", () => false);

  nuxtApp.hook("page:start", () => {
    loading.value = true;
  });

  nuxtApp.hook("page:finish", () => {
    setTimeout(() => {
      loading.value = false;
    }, 200); // Thêm delay nhỏ để đảm bảo loading hiển thị
  });

  nuxtApp.hook("app:error", () => {
    loading.value = false;
  });

  // Add router middleware to handle loading state
  const router = useRouter();
  router.beforeEach(() => {
    loading.value = true;
    return true;
  });

  router.afterEach(() => {
    setTimeout(() => {
      loading.value = false;
    }, 200);
  });
});
