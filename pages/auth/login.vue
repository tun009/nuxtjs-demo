<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900"
  >
    <!-- Particles background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 opacity-20">
        <div
          v-for="i in 20"
          :key="i"
          class="particle absolute rounded-full bg-white"
          :style="{
            width: `${Math.random() * 6 + 1}px`,
            height: `${Math.random() * 6 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }"
        ></div>
      </div>
    </div>

    <!-- Logo and branding -->
    <div class="flex-none pt-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div class="text-center">
        <h1
          class="text-3xl font-bold text-white flex items-center justify-center"
        >
          <Icon
            name="heroicons:cube-transparent"
            class="h-8 w-8 mr-2 text-blue-400"
          />
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Software License Store
          </span>
        </h1>
        <p class="mt-2 text-blue-200 text-sm">
          Manage your software licenses in one place
        </p>
      </div>
    </div>

    <!-- Login form -->
    <div
      class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10"
    >
      <div
        class="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
      >
        <div class="px-6 py-8 sm:px-10">
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-white">
              Sign in to your account
            </h2>
            <p class="mt-2 text-sm text-blue-200">
              Don't have an account?
              <NuxtLink
                to="/auth/register"
                class="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Register
              </NuxtLink>
            </p>
          </div>

          <!-- Alert message -->
          <div
            v-if="message"
            class="mb-6 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon
                  name="heroicons:exclamation-triangle"
                  class="h-5 w-5 text-yellow-500"
                />
              </div>
              <div class="ml-3">
                <p class="text-sm text-yellow-200">
                  {{ message }}
                </p>
              </div>
            </div>
          </div>

          <!-- Error message -->
          <div
            v-if="errorMessage"
            class="mb-6 bg-red-900/30 border border-red-700 rounded-lg p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-500" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-200">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                for="email-address"
                class="block text-sm font-medium text-blue-200"
              >
                Email or Username
              </label>
              <div class="mt-1 relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Icon
                    name="heroicons:envelope"
                    class="h-5 w-5 text-blue-400"
                  />
                </div>
                <input
                  id="email-address"
                  v-model="form.email"
                  name="email"
                  type="text"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full pl-10 pr-3 py-2 border border-blue-700 rounded-lg bg-blue-900/30 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email or username"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-blue-200"
              >
                Password
              </label>
              <div class="mt-1 relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <Icon
                    name="heroicons:lock-closed"
                    class="h-5 w-5 text-blue-400"
                  />
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  class="appearance-none block w-full pl-10 pr-10 py-2 border border-blue-700 rounded-lg bg-blue-900/30 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Icon
                    :name="
                      showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'
                    "
                    class="h-5 w-5 text-blue-400 hover:text-blue-300 transition-colors"
                  />
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="form.rememberMe"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-700 rounded bg-blue-900/30"
                />
                <label
                  for="remember-me"
                  class="ml-2 block text-sm text-blue-200"
                >
                  Remember me
                </label>
              </div>

              <div class="text-sm">
                <NuxtLink
                  to="/auth/forgot-password"
                  class="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </NuxtLink>
              </div>
            </div>

            <div>
              <ButtonLoading
                type="submit"
                :loading="isSubmitting"
                variant="primary"
                class="w-full"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Icon
                    name="heroicons:lock-closed"
                    class="h-5 w-5 text-blue-300 group-hover:text-blue-200"
                  />
                </span>
                {{ isSubmitting ? "Signing in..." : "Sign in" }}
              </ButtonLoading>
            </div>
          </form>

          <!-- Quick login button -->
          <div class="mt-6">
            <button
              type="button"
              @click="loginAsAdmin"
              class="w-full inline-flex justify-center py-2 px-4 border border-blue-700 rounded-lg shadow-sm bg-blue-900/30 text-sm font-medium text-blue-200 hover:bg-blue-800/40 transition-colors"
            >
              <Icon
                name="heroicons:user-circle"
                class="h-5 w-5 mr-2 text-blue-400"
              />
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-none py-6 px-4 sm:px-6 lg:px-8">
      <div class="text-center text-blue-300 text-sm">
        &copy; {{ new Date().getFullYear() }} Software License Store. All rights
        reserved.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";
import { API_CONFIG_ADMIN } from "~/utils/constants";
import { ROUTES } from "~/utils/constants";

definePageMeta({
  layout: false,
});

const config = useRuntimeConfig();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// Form data
const form = ref({
  email: "",
  password: "",
  rememberMe: false,
});

// Password visibility
const showPassword = ref(false);
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Error message
const errorMessage = ref("");
const isSubmitting = ref(false);

// Lấy thông báo và redirect URL từ query params
const message = computed(() => route.query.message || "");
const redirectPath = computed(() => route.query.redirect || "/");

// Xử lý đăng nhập
const handleLogin = async () => {
  // Reset error message
  errorMessage.value = "";

  // Validate form
  if (!form.value.email || !form.value.password) {
    errorMessage.value = "Please enter both email/username and password";
    return;
  }

  isSubmitting.value = true;
  try {
    const result = await userStore.login(form.value.email, form.value.password);

    if (result.success) {
      // Chuyển hướng dựa vào role
      if (userStore.isAdmin) {
        router.push(ROUTES.ADMIN_HOME);
      } else if (userStore.isUser) {
        router.push(ROUTES.USER_HOME);
      } else {
        // Nếu không có role cụ thể, chuyển hướng đến trang chủ
        router.push(ROUTES.HOME);
      }
    } else {
      errorMessage.value = result.error || "Invalid email/username or password";
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = "An error occurred during login";
  } finally {
    isSubmitting.value = false;
  }
};

// Demo credentials
const loginAsAdmin = () => {
  const redirect_uri = `${window.location.origin}/auth/callback`;
  const response_type = "code";
  const url = `${config.public.apiBaseUrl}/oauth/authorize?client_id=${API_CONFIG_ADMIN.CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=${response_type}&state=${API_CONFIG_ADMIN.STATE}`;
  window.location.href = url;
};
</script>

<style scoped>
.particle {
  animation: float linear infinite;
  opacity: 0.6;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}
</style>
