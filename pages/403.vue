<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full"
    >
      <h1 class="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Truy cập bị từ chối
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        {{ message || "Bạn không có quyền truy cập trang này." }}
      </p>
      <div class="flex justify-center space-x-4">
        <NuxtLink
          to="/"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Về trang chủ
        </NuxtLink>
        <button
          @click="goBack"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-md transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
definePageMeta({
  layout: false,
  middleware: [],
});
// Lấy thông báo từ query params nếu có
const message = computed(() => route.query.message || "");

// Hàm quay lại trang trước
const goBack = () => {
  router.back();
};
</script>
