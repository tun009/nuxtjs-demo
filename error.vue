<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="glass-card p-8 rounded-xl w-full max-w-md text-center">
      <div class="mb-8">
        <Icon
          :name="error.statusCode === 404 ? 'material-symbols:error' : 'material-symbols:warning'"
          class="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4"
        />
        <h1 class="text-4xl font-bold mb-2">
          {{ error.statusCode === 404 ? 'Page Not Found' : 'An Error Occurred' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          {{ error.message || 'Sorry, something went wrong.' }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleError"
          class="btn-gradient px-6 py-2"
        >
          Try Again
        </button>
        <NuxtLink
          to="/"
          class="px-6 py-2 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const error = useError()

const handleError = () => {
  clearError({ redirect: '/' })
}
</script> 