<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="glass-card p-8 rounded-xl w-full max-w-md space-y-8">
      <div class="text-center">
        <NuxtLink to="/" class="text-2xl font-bold text-primary-600 dark:text-primary-400 flex items-center justify-center gap-2 mb-6">
          <Icon name="fluent:window-dev-tools-24-filled" />
          SoftLicense
        </NuxtLink>
        <h2 class="text-3xl font-bold">{{ $t('common.register') }}</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {{ $t('auth.haveAccount') }}
          <NuxtLink
            to="/auth/login"
            class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ $t('common.login') }}
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <!-- Full Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {{ $t('auth.fullName') }}
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 dark:bg-gray-800/50"
                :placeholder="$t('auth.fullNamePlaceholder')"
              />
            </div>
          </div>

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

          <!-- Confirm Password -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {{ $t('auth.confirmPassword') }}
            </label>
            <div class="mt-1 relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white/50 dark:bg-gray-800/50"
                :placeholder="$t('auth.confirmPasswordPlaceholder')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <Icon
                  :name="showConfirmPassword ? 'material-symbols:visibility-off' : 'material-symbols:visibility'"
                  class="h-5 w-5 text-gray-400"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            for="terms"
            class="ml-2 block text-sm text-gray-900 dark:text-gray-100"
          >
            {{ $t('auth.acceptTerms') }}
            <NuxtLink
              to="/terms"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              {{ $t('auth.termsAndConditions') }}
            </NuxtLink>
          </label>
        </div>

        <div>
          <button
            type="submit"
            class="btn-gradient w-full py-3 text-lg font-semibold"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <Icon name="eos-icons:loading" class="animate-spin -ml-1 mr-2 h-5 w-5" />
              {{ $t('auth.registering') }}
            </span>
            <span v-else>
              {{ $t('common.register') }}
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
import { useNuxtApp } from '#app'
import { useRouter } from 'vue-router'

const { $auth } = useNuxtApp();
const router = useRouter();

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  return (
    name.value.length > 0 &&
    email.value.length > 0 &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value &&
    acceptTerms.value
  )
})

const handleRegister = async () => {
  try {
    if (!isFormValid.value) {
      error.value = 'Please fill in all required fields correctly'
      return
    }

    loading.value = true
    error.value = ''

    // Trong thực tế, bạn sẽ gọi API để đăng ký
    // Đây là mã giả, giả lập đăng ký thành công và chuyển hướng đến trang đăng nhập
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Chuyển hướng đến trang đăng nhập với thông báo thành công
    router.push({
      path: '/auth/login',
      query: { registered: 'true' }
    })
  } catch (err) {
    error.value = err.message || 'An error occurred during registration'
  } finally {
    loading.value = false
  }
}
</script> 