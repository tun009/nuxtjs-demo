<script setup>
/**
 * Component Modal có thể tái sử dụng
 *
 * Props:
 * - modelValue: Trạng thái hiển thị của modal
 * - title: Tiêu đề của modal
 * - size: Kích thước của modal (sm, md, lg, xl)
 * - closeOnClickOutside: Có đóng modal khi click ra ngoài không
 * - showClose: Có hiển thị nút đóng không
 *
 * Events:
 * - update:modelValue: Khi trạng thái hiển thị thay đổi
 * - close: Khi modal đóng
 */

const props = defineProps({
  // Trạng thái hiển thị của modal
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Tiêu đề của modal
  title: {
    type: String,
    default: "",
  },
  // Kích thước của modal
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  // Có đóng modal khi click ra ngoài không
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  // Có hiển thị nút đóng không
  showClose: {
    type: Boolean,
    default: true,
  },
});

// Emit events
const emit = defineEmits(["update:modelValue", "close"]);

// Đóng modal
const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

// Xử lý click overlay
const handleOverlayClick = () => {
  if (props.closeOnClickOutside) {
    closeModal();
  }
};

// Ngăn sự kiện click lan truyền từ nội dung modal
const handleContentClick = (e) => {
  e.stopPropagation();
};

// Xử lý khi nhấn ESC
const handleKeyDown = (e) => {
  if (e.key === "Escape" && props.modelValue) {
    closeModal();
  }
};

// Thêm event listener khi component được mount
onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

// Xóa event listener khi component bị unmount
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});

// Thiết lập max-width dựa vào kích thước
const modalWidth = computed(() => {
  switch (props.size) {
    case "sm":
      return "max-w-md";
    case "md":
      return "max-w-lg";
    case "lg":
      return "max-w-2xl";
    case "xl":
      return "max-w-4xl";
    default:
      return "max-w-lg";
  }
});

// Theo dõi trạng thái modelValue để thêm/xóa class overflow-hidden cho body
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleOverlayClick"
      >
        <div
          class="flex items-center justify-center min-h-screen p-4 text-center"
        >
          <!-- Overlay -->
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75"
            aria-hidden="true"
          ></div>

          <!-- Modal Content -->
          <div
            :class="[
              'relative bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-full',
              modalWidth,
            ]"
            @click="handleContentClick"
          >
            <!-- Header -->
            <div
              class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
            >
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ title }}
              </h3>
              <button
                v-if="showClose"
                @click="closeModal"
                class="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              >
                <span class="sr-only">Close</span>
                <Icon name="heroicons:x-mark" class="h-5 w-5" />
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-4">
              <slot></slot>
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-gray-200 dark:border-gray-700"
            >
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
