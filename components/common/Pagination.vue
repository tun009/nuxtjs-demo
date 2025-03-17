<script setup>
/**
 * Component phân trang có thể tái sử dụng
 * 
 * Props:
 * - currentPage: Trang hiện tại
 * - perPage: Số bản ghi mỗi trang
 * - total: Tổng số bản ghi
 * - perPageOptions: Các tùy chọn số bản ghi mỗi trang
 * 
 * Events:
 * - page-change: Khi người dùng chuyển trang
 * - per-page-change: Khi người dùng thay đổi số bản ghi mỗi trang
 */

const props = defineProps({
  // Trang hiện tại
  currentPage: {
    type: Number,
    required: true
  },
  // Số bản ghi mỗi trang
  perPage: {
    type: Number,
    required: true
  },
  // Tổng số bản ghi
  total: {
    type: Number,
    required: true
  },
  // Các tùy chọn số bản ghi mỗi trang
  perPageOptions: {
    type: Array,
    default: () => [
      { value: 10, label: '10 per page' },
      { value: 50, label: '50 per page' },
      { value: 100, label: '100 per page' }
    ]
  }
});

// Emit events
const emit = defineEmits(['page-change', 'per-page-change']);

// Tính toán các giá trị phân trang
const lastPage = computed(() => Math.ceil(props.total / props.perPage) || 1);
const fromRecord = computed(() => props.total === 0 ? 0 : (props.currentPage - 1) * props.perPage + 1);
const toRecord = computed(() => Math.min(props.currentPage * props.perPage, props.total));

// Xử lý chuyển trang
const changePage = (page) => {
  if (page < 1 || page > lastPage.value) return;
  emit('page-change', page);
};

// Xử lý thay đổi số bản ghi mỗi trang
const changePerPage = (value) => {
  emit('per-page-change', Number(value));
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
    <!-- Per Page Selection -->
    <div class="flex items-center mb-4 sm:mb-0">
      <label for="perPage" class="mr-2 text-sm text-gray-700 dark:text-gray-300">Show:</label>
      <select 
        id="perPage" 
        :value="perPage" 
        @change="changePerPage($event.target.value)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option v-for="option in perPageOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    
    <!-- Pagination Info and Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-auto">
      <!-- Pagination Info -->
      <div class="mb-4 sm:mb-0 sm:mr-4">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Showing <span class="font-medium">{{ fromRecord }}</span> to 
          <span class="font-medium">{{ toRecord }}</span> of 
          <span class="font-medium">{{ total }}</span> results
        </p>
      </div>
      
      <!-- Pagination Controls -->
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <!-- Previous Page Button -->
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            :class="[
              'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
              currentPage === 1 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
          >
            <span class="sr-only">Previous</span>
            <Icon name="heroicons:chevron-left" class="h-5 w-5" />
          </button>
          
          <!-- Page Numbers -->
          <template v-for="page in lastPage" :key="page">
            <!-- Hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại -->
            <button 
              v-if="page === 1 || page === lastPage || (page >= currentPage - 1 && page <= currentPage + 1)"
              @click="changePage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
                page === currentPage
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-500'
                  : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
              ]"
            >
              {{ page }}
            </button>
            
            <!-- Hiển thị dấu ... nếu có khoảng cách -->
            <span 
              v-else-if="(page === 2 && currentPage > 3) || (page === lastPage - 1 && currentPage < lastPage - 2)"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white"
            >
              ...
            </span>
          </template>
          
          <!-- Next Page Button -->
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === lastPage"
            :class="[
              'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
              currentPage === lastPage 
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
          >
            <span class="sr-only">Next</span>
            <Icon name="heroicons:chevron-right" class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template> 