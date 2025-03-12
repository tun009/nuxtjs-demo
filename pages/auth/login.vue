<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <NuxtLink
            to="/auth/register"
            class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            create a new account
          </NuxtLink>
        </p>
      </div>

      <!-- Alert message -->
      <div
        v-if="message"
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-600"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon
              name="heroicons:exclamation-triangle"
              class="h-5 w-5 text-yellow-400"
            />
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700 dark:text-yellow-200">
              {{ message }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error message -->
      <div
        v-if="errorMessage"
        class="bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/20 dark:border-red-600"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:x-circle" class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700 dark:text-red-200">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              for="remember-me"
              class="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <NuxtLink
              to="/auth/forgot-password"
              class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot your password?
            </NuxtLink>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <Icon
                name="heroicons:arrow-path"
                class="h-5 w-5 text-blue-400 animate-spin"
              />
            </span>
            <span
              v-else
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <Icon
                name="heroicons:lock-closed"
                class="h-5 w-5 text-blue-500 group-hover:text-blue-400"
              />
            </span>
            {{ isSubmitting ? "Signing in..." : "Sign in" }}
          </button>
        </div>
      </form>

      <!-- Demo credentials -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-gray-300 dark:border-gray-700"
            ></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
              >Demo credentials</span
            >
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="fillAdminCredentials"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Icon
              name="heroicons:user-circle"
              class="h-5 w-5 mr-2 text-gray-500"
            />
            Admin User
          </button>
          <button
            type="button"
            @click="fillUserCredentials"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Icon name="heroicons:user" class="h-5 w-5 mr-2 text-gray-500" />
            Regular User
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "~/middleware/admin";

const { login } = useAuth();
const router = useRouter();
const route = useRoute();

// Form data
const form = ref({
  email: "",
  password: "",
  rememberMe: false,
});

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
    errorMessage.value = "Please enter both email and password";
    return;
  }

  isSubmitting.value = true;

  try {
    // Gọi hàm login từ composable
    const success = login(form.value.email, form.value.password);

    if (success) {
      // Redirect to the requested page or dashboard
      router.push(redirectPath.value);
    } else {
      errorMessage.value = "Invalid email or password";
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMessage.value = "An error occurred during login";
  } finally {
    isSubmitting.value = false;
  }
};

// Demo credentials
const fillAdminCredentials = () => {
  form.value.email = "admin@example.com";
  form.value.password = "admin";
};

const fillUserCredentials = () => {
  form.value.email = "user@example.com";
  form.value.password = "user";
};
</script>
