<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
    <!-- Particles background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 opacity-20">
        <div v-for="i in 20" :key="i" 
          class="particle absolute rounded-full bg-white"
          :style="{
            width: `${Math.random() * 6 + 1}px`,
            height: `${Math.random() * 6 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }">
        </div>
      </div>
    </div>

    <!-- Logo and branding -->
    <div class="flex-none pt-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-white flex items-center justify-center">
          <Icon name="heroicons:cube-transparent" class="h-8 w-8 mr-2 text-blue-400" />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Software License Store
          </span>
        </h1>
        <p class="mt-2 text-blue-200 text-sm">Manage your software licenses in one place</p>
      </div>
    </div>

    <!-- Register form -->
    <div class="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div class="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
        <div class="px-6 py-8 sm:px-10">
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-white">Create an Account</h2>
            <p class="mt-2 text-sm text-blue-200">
              Already have an account? 
              <NuxtLink
                to="/auth/login"
                class="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Login
              </NuxtLink>
            </p>
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

          <form class="space-y-6" @submit.prevent="handleRegister">
            <div>
              <label for="full-name" class="block text-sm font-medium text-blue-200">
                Full Name
              </label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="heroicons:user" class="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="full-name"
                  v-model="form.name"
                  name="name"
                  type="text"
                  required
                  class="appearance-none block w-full pl-10 pr-3 py-2 border border-blue-700 rounded-lg bg-blue-900/30 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label for="email-address" class="block text-sm font-medium text-blue-200">
                Email Address
              </label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="heroicons:envelope" class="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="email-address"
                  v-model="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="appearance-none block w-full pl-10 pr-3 py-2 border border-blue-700 rounded-lg bg-blue-900/30 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-blue-200">
                Password
              </label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="heroicons:lock-closed" class="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full pl-10 pr-3 py-2 border border-blue-700 rounded-lg bg-blue-900/30 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Create a password"
                />
              </div>
              <p class="mt-1 text-xs text-blue-300">Password must be at least 8 characters long</p>
            </div>

            <div>
              <label for="confirm-password" class="block text-sm font-medium text-blue-200">
                Confirm Password
              </label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="heroicons:lock-closed" class="h-5 w-5 text-blue-400" />
                </div>
                <input
                  id="confirm-password"
                  v-model="form.confirmPassword"
                  name="confirm-password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="appearance-none block w-full pl-10 pr-3 py-2 border border-blue-700 rounded-lg bg-blue-900/30 placeholder-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="terms"
                v-model="form.agreeToTerms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-700 rounded bg-blue-900/30"
              />
              <label for="terms" class="ml-2 block text-sm text-blue-200">
                I agree to the 
                <NuxtLink to="/terms" class="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </NuxtLink>
                 and 
                <NuxtLink to="/privacy" class="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </NuxtLink>
              </label>
            </div>

            <div>
              <ButtonLoading
                type="submit"
                :loading="isSubmitting"
                variant="primary"
                class="w-full"
              >
                <span
                  class="absolute left-0 inset-y-0 flex items-center pl-3"
                >
                  <Icon
                    name="heroicons:user-plus"
                    class="h-5 w-5 text-blue-300 group-hover:text-blue-200"
                  />
                </span>
                {{ isSubmitting ? "Creating account..." : "Create account" }}
              </ButtonLoading>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex-none py-6 px-4 sm:px-6 lg:px-8">
      <div class="text-center text-blue-300 text-sm">
        &copy; {{ new Date().getFullYear() }} Software License Store. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const router = useRouter();

// Form data
const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false
});

// Error message
const errorMessage = ref("");
const isSubmitting = ref(false);

// Xử lý đăng ký
const handleRegister = async () => {
  // Reset error message
  errorMessage.value = "";

  // Validate form
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.confirmPassword) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  if (form.value.password.length < 8) {
    errorMessage.value = "Password must be at least 8 characters long";
    return;
  }

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  if (!form.value.agreeToTerms) {
    errorMessage.value = "You must agree to the Terms of Service and Privacy Policy";
    return;
  }

  isSubmitting.value = true;

  try {
    // Giả lập đăng ký thành công
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Chuyển hướng đến trang đăng nhập với thông báo thành công
    router.push('/auth/login?message=Account created successfully. Please sign in.');
  } catch (error) {
    console.error("Registration error:", error);
    errorMessage.value = "An error occurred during registration";
  } finally {
    isSubmitting.value = false;
  }
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