<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
  >
    <div class="relative">
      <!-- Loading spinner with gradient -->
      <div class="w-16 h-16">
        <div class="loading-spinner"></div>
        <div class="loading-spinner" style="animation-delay: -0.5s"></div>
        <div class="loading-spinner" style="animation-delay: -1s"></div>
      </div>
      
      <!-- Loading text -->
      <div class="absolute top-full left-1/2 -translate-x-1/2 mt-4">
        <p class="text-white font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = useState('loading', () => false);
</script>

<style scoped>
.loading-spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #3b82f6;
  border-right-color: #6366f1;
  border-bottom-color: #8b5cf6;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 