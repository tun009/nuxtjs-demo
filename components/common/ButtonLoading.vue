<template>
  <button
    :disabled="loading || disabled"
    :class="[
      'relative inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium focus:outline-none transition-all duration-200',
      loading ? 'cursor-not-allowed' : 'cursor-pointer',
      variant === 'primary' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white' : '',
      variant === 'secondary' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : '',
      variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : '',
      variant === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : '',
      variant === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      className
    ]"
    @click="!loading && !disabled && $emit('click')"
  >
    <!-- Loading spinner -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <svg
        class="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>

    <!-- Button content -->
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning'].includes(value)
  },
  className: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script> 