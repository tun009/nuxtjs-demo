<script setup>
/**
 * Component PageHeader có thể tái sử dụng
 *
 * Props:
 * - title: Tiêu đề trang
 * - actionText: Text cho nút hành động
 * - actionIcon: Icon cho nút hành động
 * - actionRoute: Route cho nút hành động
 * - showAction: Có hiển thị nút hành động không
 *
 * Events:
 * - action: Khi người dùng click vào nút hành động (nếu không có actionRoute)
 */

const props = defineProps({
  // Tiêu đề trang
  title: {
    type: String,
    required: true,
  },
  // Text cho nút hành động
  actionText: {
    type: String,
    default: "",
  },
  // Icon cho nút hành động
  actionIcon: {
    type: String,
    default: "",
  },
  // Route cho nút hành động
  actionRoute: {
    type: String,
    default: "",
  },
  // Có hiển thị nút hành động không
  showAction: {
    type: Boolean,
    default: true,
  },
});

// Emit events
const emit = defineEmits(["action"]);

// Xử lý click vào nút hành động
const handleAction = () => {
  if (!props.actionRoute) {
    emit("action");
  }
};
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">{{ title }}</h1>
    <NuxtLink
      v-if="showAction && actionRoute"
      :to="actionRoute"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
    >
      <Icon v-if="actionIcon" :name="actionIcon" class="h-5 w-5 mr-2" />
      {{ actionText }}
    </NuxtLink>
    <button
      v-else-if="showAction"
      @click="handleAction"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
    >
      <Icon v-if="actionIcon" :name="actionIcon" class="h-5 w-5 mr-2" />
      {{ actionText }}
    </button>
  </div>
</template>
