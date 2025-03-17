<script setup>
/**
 * Component SearchBar có thể tái sử dụng
 * 
 * Props:
 * - value: Giá trị tìm kiếm
 * - placeholder: Placeholder cho input
 * - buttonText: Text cho nút tìm kiếm
 * - showButton: Có hiển thị nút tìm kiếm không
 * 
 * Events:
 * - update:value: Khi giá trị thay đổi
 * - search: Khi người dùng nhấn Enter hoặc click nút tìm kiếm
 */

const props = defineProps({
  // Giá trị tìm kiếm
  value: {
    type: String,
    default: ''
  },
  // Placeholder cho input
  placeholder: {
    type: String,
    default: 'Search...'
  },
  // Text cho nút tìm kiếm
  buttonText: {
    type: String,
    default: 'Search'
  },
  // Có hiển thị nút tìm kiếm không
  showButton: {
    type: Boolean,
    default: true
  }
});

// Emit events
const emit = defineEmits(['update:value', 'search']);

// Giá trị tìm kiếm
const searchValue = computed({
  get: () => props.value,
  set: (value) => emit('update:value', value)
});

// Xử lý tìm kiếm
const handleSearch = () => {
  emit('search', searchValue.value);
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
          </div>
          <input 
            v-model="searchValue"
            type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
            :placeholder="placeholder" 
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      <div v-if="showButton">
        <button @click="handleSearch" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Icon name="heroicons:magnifying-glass" class="h-5 w-5 mr-2" />
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template> 