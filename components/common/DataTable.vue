<script setup>
/**
 * Component DataTable có thể tái sử dụng
 *
 * Props:
 * - columns: Cấu hình các cột của bảng
 * - items: Dữ liệu hiển thị trong bảng
 * - loading: Trạng thái đang tải dữ liệu
 * - sortBy: Cột đang được sắp xếp
 * - sortDirection: Hướng sắp xếp (asc/desc)
 * - emptyMessage: Thông báo khi không có dữ liệu
 * - actionsDropdown: Sử dụng dropdown cho actions thay vì các nút riêng lẻ
 *
 * Events:
 * - sort: Khi người dùng click vào header để sắp xếp
 * - row-click: Khi người dùng click vào một hàng
 * - action: Khi người dùng thực hiện một hành động (view, edit, delete, ...)
 */

const props = defineProps({
  // Cấu hình các cột của bảng
  columns: {
    type: Array,
    required: true,
    // Mỗi cột có cấu trúc: { key, label, sortable, width, align, class }
  },
  // Dữ liệu hiển thị trong bảng
  items: {
    type: Array,
    default: () => [],
  },
  // Trạng thái đang tải dữ liệu
  loading: {
    type: Boolean,
    default: false,
  },
  // Cột đang được sắp xếp
  sortBy: {
    type: String,
    default: "",
  },
  // Hướng sắp xếp (asc/desc)
  sortDirection: {
    type: String,
    default: "asc",
    validator: (value) => ["asc", "desc"].includes(value),
  },
  // Thông báo khi không có dữ liệu
  emptyMessage: {
    type: String,
    default: "No data found",
  },
  // Các hành động có thể thực hiện trên mỗi hàng
  actions: {
    type: Array,
    default: () => [],
    // Mỗi action có cấu trúc: { key, icon, label, color, show }
  },
  // Sử dụng dropdown cho actions thay vì các nút riêng lẻ
  actionsDropdown: {
    type: Boolean,
    default: false,
  },
});

// Emit events
const emit = defineEmits(["sort", "row-click", "action"]);

// Xử lý sắp xếp
const handleSort = (column) => {
  if (!column.sortable) return;
  emit("sort", column.key);
};

// Xử lý click vào hàng
const handleRowClick = (item, index) => {
  emit("row-click", { item, index });
};

// Xử lý hành động
const handleAction = (action, item, index) => {
  emit("action", { action: action.key, item, index });
};

// Hiển thị icon sắp xếp
const getSortIcon = (column) => {
  if (!column.sortable) return null;
  if (props.sortBy !== column.key) return "heroicons:arrows-up-down";
  return props.sortDirection === "asc"
    ? "heroicons:arrow-up"
    : "heroicons:arrow-down";
};

// Kiểm tra xem action có hiển thị cho item không
const showAction = (action, item) => {
  if (typeof action.show === "function") {
    return action.show(item);
  }
  return true;
};

// Quản lý trạng thái dropdown
const openDropdowns = ref({});

// Mở/đóng dropdown
const toggleDropdown = (itemId) => {
  openDropdowns.value = {
    ...openDropdowns.value,
    [itemId]: !openDropdowns.value[itemId],
  };
};

// Đóng tất cả dropdown khi click ra ngoài
const closeAllDropdowns = () => {
  openDropdowns.value = {};
};

// Đóng dropdown sau khi chọn action
const selectAction = (action, item, index) => {
  handleAction(action, item, index);
  closeAllDropdowns();
};

// Thêm event listener để đóng dropdown khi click ra ngoài
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown-container")) {
      closeAllDropdowns();
    }
  });
});

onUnmounted(() => {
  document.removeEventListener("click", closeAllDropdowns);
});
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left">
      <!-- Table Header -->
      <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            @click="handleSort(column)"
            :class="[
              'px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider',
              column.sortable
                ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                : '',
              column.align === 'center' ? 'text-center' : '',
              column.align === 'right' ? 'text-right' : '',
              column.class || '',
            ]"
            :style="column.width ? `width: ${column.width}` : ''"
          >
            <div
              class="flex items-center"
              :class="{
                'justify-center': column.align === 'center',
                'justify-end': column.align === 'right',
              }"
            >
              {{ column.label }}
              <Icon
                v-if="getSortIcon(column)"
                :name="getSortIcon(column)"
                class="h-4 w-4 ml-1"
              />
            </div>
          </th>
          <th
            v-if="actions.length"
            class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center"
            style="width: 100px"
          >
            Actions
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Loading State -->
        <tr v-if="loading">
          <td
            :colspan="actions.length ? columns.length + 1 : columns.length"
            class="px-6 py-10 text-center"
          >
            <div class="flex flex-col items-center">
              <Icon
                name="heroicons:arrow-path"
                class="h-8 w-8 text-blue-500 animate-spin"
              />
              <p class="mt-2 text-gray-600 dark:text-gray-400">
                Loading data...
              </p>
            </div>
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="items.length === 0">
          <td
            :colspan="actions.length ? columns.length + 1 : columns.length"
            class="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            {{ emptyMessage }}
          </td>
        </tr>

        <!-- Data Rows -->
        <tr
          v-else
          v-for="(item, index) in items"
          :key="index"
          @click="handleRowClick(item, index)"
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="[
              'px-6 py-4 whitespace-nowrap text-sm',
              column.align === 'center' ? 'text-center' : '',
              column.align === 'right' ? 'text-right' : '',
              column.cellClass || '',
            ]"
          >
            <!-- Sử dụng slot để tùy chỉnh hiển thị cho từng cột -->
            <slot
              :name="`cell(${column.key})`"
              :item="item"
              :value="item[column.key]"
              :index="index"
            >
              {{ item[column.key] }}
            </slot>
          </td>

          <!-- Actions Column -->
          <td
            v-if="actions.length"
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center"
          >
            <!-- Dropdown Actions -->
            <div v-if="actionsDropdown" class="dropdown-container relative">
              <button
                @click.stop="toggleDropdown(item.id || index)"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              >
                <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="openDropdowns[item.id || index]"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 py-1"
                @click.stop
              >
                <button
                  v-for="action in actions"
                  :key="action.key"
                  v-show="showAction(action, item)"
                  @click.stop="selectAction(action, item, index)"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  :class="action.color || 'text-gray-700 dark:text-gray-300'"
                >
                  <Icon :name="action.icon" class="h-4 w-4 mr-2" />
                  {{ action.label }}
                </button>
              </div>
            </div>

            <!-- Individual Action Buttons -->
            <div v-else class="flex space-x-2 justify-end">
              <button
                v-for="action in actions"
                :key="action.key"
                v-show="showAction(action, item)"
                @click.stop="handleAction(action, item, index)"
                :class="[
                  action.color ||
                    'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
                ]"
                :title="action.label"
              >
                <Icon :name="action.icon" class="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
