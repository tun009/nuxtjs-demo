<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'toast-item px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 transform transition-all duration-300',
          toastTypeClasses[toast.type]
        ]"
      >
        <div class="flex-shrink-0 mt-0.5">
          <Icon
            :name="toastIcons[toast.type]"
            class="h-5 w-5"
          />
        </div>
        <div class="flex-grow">
          <p class="text-sm">{{ toast.message }}</p>
        </div>
        <button
          @click="removeToast(toast.id)"
          class="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <Icon name="heroicons:x-mark" class="h-5 w-5" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast';

const { toasts, removeToast } = useToast();

// Icons for different toast types
const toastIcons = {
  success: 'heroicons:check-circle',
  error: 'heroicons:x-circle',
  warning: 'heroicons:exclamation-triangle',
  info: 'heroicons:information-circle'
};

// Classes for different toast types
const toastTypeClasses = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.toast-item {
  max-width: 24rem;
  backdrop-filter: blur(8px);
}
</style> 