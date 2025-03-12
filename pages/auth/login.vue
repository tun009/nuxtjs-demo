<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="glass-card p-8 rounded-xl w-full max-w-md space-y-8">
      <div class="text-center">
        <NuxtLink to="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center justify-center gap-2 mb-6">
          <Icon name="fluent:window-dev-tools-24-filled" />
          SoftLicense
        </NuxtLink>
        <h2 class="text-3xl font-bold">{{ $t('common.login') }}</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {{ $t('auth.noAccount') }}
          <NuxtLink
            to="/auth/register"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t('common.register') }}
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {{ $t('auth.email') }}
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 dark:bg-gray-800/50"
                :placeholder="$t('auth.emailPlaceholder')"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {{ $t('auth.password') }}
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 dark:bg-gray-800/50"
                :placeholder="$t('auth.passwordPlaceholder')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <Icon
                  :name="showPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'"
                  class="h-5 w-5 text-gray-400"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900 dark:text-gray-100"
            >
              {{ $t('auth.rememberMe') }}
            </label>
          </div>

          <!-- Forgot Password -->
          <div class="text-sm">
            <NuxtLink
              to="/auth/forgot-password"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {{ $t('auth.forgotPassword') }}
            </NuxtLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="btn-gradient w-full py-3 text-lg font-semibold"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <Icon name="eos-icons:loading" class="animate-spin -ml-1 mr-2 h-5 w-5" />
              {{ $t('auth.loggingIn') }}
            </span>
            <span v-else>
              {{ $t('common.login') }}
            </span>
          </button>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center"
        >
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    // Implement login logic here
    console.log('Login attempt:', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // On success, redirect to dashboard or home
    // navigateTo('/')
  } catch (err) {
    error.value = err.message || 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script> 