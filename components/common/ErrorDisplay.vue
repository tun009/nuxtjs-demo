<script setup>
/**
 * Component ErrorDisplay có thể tái sử dụng
 * 
 * Props:
 * - error: Thông báo lỗi
 * - retryText: Text cho nút thử lại
 * - showRetry: Có hiển thị nút thử lại không
 * 
 * Events:
 * - retry: Khi người dùng click vào nút thử lại
 */

const props = defineProps({
  // Thông báo lỗi
  error: {
    type: String,
    required: true
  },
  // Text cho nút thử lại
  retryText: {
    type: String,
    default: 'Try Again'
  },
  // Có hiển thị nút thử lại không
  showRetry: {
    type: Boolean,
    default: true
  }
});

// Emit events
const emit = defineEmits(['retry']);

// Xử lý thử lại
const handleRetry = () => {
  emit('retry');
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
    <div class="text-center text-red-500">
      <Icon name="heroicons:exclamation-circle" class="h-8 w-8 mx-auto" />
      <p class="mt-2">{{ error }}</p>
      <button 
        v-if="showRetry" 
        @click="handleRetry" 
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        {{ retryText }}
      </button>
    </div>
  </div>
</template> 