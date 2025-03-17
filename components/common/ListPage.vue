<script setup>
import PageHeader from '~/components/common/PageHeader.vue';
import SearchBar from '~/components/common/SearchBar.vue';
import ErrorDisplay from '~/components/common/ErrorDisplay.vue';

/**
 * Component ListPage có thể tái sử dụng
 * 
 * Props:
 * - title: Tiêu đề trang
 * - actionText: Text cho nút hành động
 * - actionIcon: Icon cho nút hành động
 * - actionRoute: Route cho nút hành động
 * - showAction: Có hiển thị nút hành động không
 * - error: Thông báo lỗi (nếu có)
 * - loading: Trạng thái đang tải dữ liệu
 * - searchValue: Giá trị tìm kiếm
 * - searchPlaceholder: Placeholder cho ô tìm kiếm
 * - showSearch: Có hiển thị ô tìm kiếm không
 * 
 * Events:
 * - update:searchValue: Khi giá trị tìm kiếm thay đổi
 * - search: Khi người dùng tìm kiếm
 * - retry: Khi người dùng thử lại khi có lỗi
 * - action: Khi người dùng click vào nút hành động (nếu không có actionRoute)
 */

const props = defineProps({
  // Tiêu đề trang
  title: {
    type: String,
    required: true
  },
  // Text cho nút hành động
  actionText: {
    type: String,
    default: ''
  },
  // Icon cho nút hành động
  actionIcon: {
    type: String,
    default: ''
  },
  // Route cho nút hành động
  actionRoute: {
    type: String,
    default: ''
  },
  // Có hiển thị nút hành động không
  showAction: {
    type: Boolean,
    default: true
  },
  // Thông báo lỗi (nếu có)
  error: {
    type: String,
    default: ''
  },
  // Trạng thái đang tải dữ liệu
  loading: {
    type: Boolean,
    default: false
  },
  // Giá trị tìm kiếm
  searchValue: {
    type: String,
    default: ''
  },
  // Placeholder cho ô tìm kiếm
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  // Có hiển thị ô tìm kiếm không
  showSearch: {
    type: Boolean,
    default: true
  }
});

// Emit events
const emit = defineEmits(['update:searchValue', 'search', 'retry', 'action']);

// Xử lý tìm kiếm
const handleSearch = (value) => {
  emit('search', value);
};

// Xử lý thử lại
const handleRetry = () => {
  emit('retry');
};

// Xử lý hành động
const handleAction = () => {
  emit('action');
};

// Giá trị tìm kiếm
const searchValueModel = computed({
  get: () => props.searchValue,
  set: (value) => emit('update:searchValue', value)
});
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Page Header -->
    <PageHeader
      :title="title"
      :action-text="actionText"
      :action-icon="actionIcon"
      :action-route="actionRoute"
      :show-action="showAction"
      @action="handleAction"
    />
    
    <!-- Search -->
    <SearchBar
      v-if="showSearch"
      v-model:value="searchValueModel"
      :placeholder="searchPlaceholder"
      button-text="Search"
      @search="handleSearch"
      class="mb-6"
    />
    
    <!-- Error state -->
    <ErrorDisplay
      v-if="error"
      :error="error"
      retry-text="Try Again"
      @retry="handleRetry"
    />
    
    <!-- Content -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex-1 flex flex-col">
      <!-- Slot for content -->
      <slot></slot>
      
      <!-- Slot for pagination -->
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<style scoped>
.h-full {
  height: calc(100vh - 180px); /* Điều chỉnh chiều cao để phù hợp với layout */
}
</style> 