<template>
  <div class="min-h-screen flex flex-col" :class="[
    colorMode.value === 'dark' 
      ? 'bg-gradient-to-br from-gray-900 to-black' 
      : 'bg-white'
  ]">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 transition-colors border-b" 
      :class="[
        colorMode.value === 'dark' 
          ? 'bg-gray-900/80 border-gray-800 backdrop-blur-lg' 
          : 'bg-white border-gray-200 shadow-md'
      ]">
      <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <Icon name="material-symbols:code" class="w-8 h-8 text-primary-500" />
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-neon-blue">
            SoftLicense
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink to="/" :class="[
            colorMode.value === 'dark' 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-800 hover:text-primary-600 font-medium'
          ]" class="transition-colors">
            {{ $t('common.home') }}
          </NuxtLink>
          <NuxtLink to="/products" :class="[
            colorMode.value === 'dark' 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-800 hover:text-primary-600 font-medium'
          ]" class="transition-colors">
            {{ $t('common.products') }}
          </NuxtLink>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <select v-model="locale" :class="[
            colorMode.value === 'dark' 
              ? 'bg-transparent text-gray-300 border-gray-700' 
              : 'bg-gray-100 text-gray-800 border-gray-200'
          ]" class="border rounded-lg px-2 py-1">
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>

          <!-- Theme Toggle -->
          <button @click="toggleColorMode" :class="[
            colorMode.value === 'dark' 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-700 hover:text-primary-600'
          ]">
            <Icon v-if="colorMode.value === 'dark'" name="material-symbols:dark-mode" class="w-6 h-6" />
            <Icon v-else name="material-symbols:light-mode" class="w-6 h-6" />
          </button>

          <!-- Auth -->
          <div class="flex items-center space-x-2">
            <template v-if="userStore.isAuthenticated">
              <div ref="userMenuRef" class="relative">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 focus:outline-none"
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-white hover:text-blue-300'
                      : 'text-gray-800 hover:text-blue-600'
                  ]"
                >
                  <div class="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2"
                  :class="[
                    colorMode.value === 'dark'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-blue-400 bg-blue-100'
                  ]">
                    <span class="text-lg font-semibold">
                      {{ userInitial }}
                    </span>
                  </div>
                  <span class="hidden md:block font-medium">
                    {{ userName }}
                  </span>
                  <Icon name="heroicons:chevron-down" class="w-4 h-4" />
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-gray-200'
                  ]"
                >
                  <div class="py-1">
                    <div class="border-b px-4 py-2"
                      :class="[
                        colorMode.value === 'dark'
                          ? 'border-gray-700'
                          : 'border-gray-200'
                      ]">
                      <p :class="[
                        colorMode.value === 'dark'
                          ? 'text-white'
                          : 'text-gray-900'
                      ]" class="font-medium">{{ userEmail }}</p>
                      <p :class="[
                        colorMode.value === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      ]" class="text-sm">{{ userRoleDisplay }}</p>
                    </div>
                    <NuxtLink 
                      :to="userStore.isAdmin ? '/admin/dashboard' : '/user/dashboard'" 
                      class="block px-4 py-2 text-sm"
                      :class="[
                        colorMode.value === 'dark'
                          ? 'text-white hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      ]">
                      Dashboard
                    </NuxtLink>
                    <NuxtLink 
                      to="/account/profile" 
                      class="block px-4 py-2 text-sm"
                      :class="[
                        colorMode.value === 'dark'
                          ? 'text-white hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      ]">
                      Account Settings
                    </NuxtLink>
                    <button
                      @click="logout"
                      class="block w-full text-left px-4 py-2 text-sm"
                      :class="[
                        colorMode.value === 'dark'
                          ? 'text-white hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      ]">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <NuxtLink to="/auth/login" :class="[
                colorMode.value === 'dark'
                  ? 'bg-primary-500 hover:bg-primary-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              ]" class="text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg">
                {{ $t('common.login') }}
              </NuxtLink>
              <NuxtLink to="/auth/register" :class="[
                colorMode.value === 'dark'
                  ? 'text-primary-400 border-primary-500/50 hover:border-primary-400 bg-transparent'
                  : 'text-blue-600 border-blue-300 hover:border-blue-400 bg-white hover:bg-gray-50'
              ]" class="border px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md">
                {{ $t('common.register') }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow pt-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer :class="[
      colorMode.value === 'dark' 
        ? 'bg-gray-900/80 border-gray-800' 
        : 'bg-gray-100 border-gray-200'
    ]" class="border-t py-16 transition-colors">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="space-y-4">
            <h3 :class="[
              colorMode.value === 'dark' 
                ? 'text-white' 
                : 'text-gray-900'
            ]" class="text-xl font-bold">SoftLicense</h3>
            <p :class="[
              colorMode.value === 'dark' 
                ? 'text-gray-400' 
                : 'text-gray-700'
            ]">
              Your trusted source for premium software licenses.
            </p>
            <div class="flex space-x-4">
              <a href="#" :class="[
                colorMode.value === 'dark' 
                  ? 'text-gray-400 hover:text-primary-400' 
                  : 'text-gray-600 hover:text-blue-600'
              ]">
                <Icon name="mdi:facebook" class="w-6 h-6" />
              </a>
              <a href="#" :class="[
                colorMode.value === 'dark' 
                  ? 'text-gray-400 hover:text-primary-400' 
                  : 'text-gray-600 hover:text-blue-600'
              ]">
                <Icon name="mdi:twitter" class="w-6 h-6" />
              </a>
              <a href="#" :class="[
                colorMode.value === 'dark' 
                  ? 'text-gray-400 hover:text-primary-400' 
                  : 'text-gray-600 hover:text-blue-600'
              ]">
                <Icon name="mdi:linkedin" class="w-6 h-6" />
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 :class="[
              colorMode.value === 'dark' 
                ? 'text-white' 
                : 'text-gray-900'
            ]" class="text-lg font-semibold">Quick Links</h3>
            <ul class="space-y-2">
              <li v-for="link in ['About Us', 'Products', 'Pricing', 'Contact']" :key="link">
                <NuxtLink :to="'/' + link.toLowerCase().replace(' ', '')" :class="[
                  colorMode.value === 'dark' 
                    ? 'text-gray-400 hover:text-primary-400' 
                    : 'text-gray-700 hover:text-blue-600'
                ]">{{ link }}</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-4">
            <h3 :class="[
              colorMode.value === 'dark' 
                ? 'text-white' 
                : 'text-gray-900'
            ]" class="text-lg font-semibold">Support</h3>
            <ul class="space-y-2">
              <li v-for="link in ['FAQ', 'Documentation', 'Terms of Service', 'Privacy Policy']" :key="link">
                <NuxtLink :to="'/' + link.toLowerCase().replace(' ', '')" :class="[
                  colorMode.value === 'dark' 
                    ? 'text-gray-400 hover:text-primary-400' 
                    : 'text-gray-700 hover:text-blue-600'
                ]">{{ link }}</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="space-y-4">
            <h3 :class="[
              colorMode.value === 'dark' 
                ? 'text-white' 
                : 'text-gray-900'
            ]" class="text-lg font-semibold">Contact Us</h3>
            <ul class="space-y-2">
              <li :class="[
                colorMode.value === 'dark' 
                  ? 'text-gray-400' 
                  : 'text-gray-700'
              ]" class="flex items-center space-x-2">
                <Icon name="material-symbols:location-on" class="w-5 h-5 text-blue-600" />
                <span>123 Software Street, Digital City</span>
              </li>
              <li :class="[
                colorMode.value === 'dark' 
                  ? 'text-gray-400' 
                  : 'text-gray-700'
              ]" class="flex items-center space-x-2">
                <Icon name="material-symbols:mail" class="w-5 h-5 text-blue-600" />
                <a href="mailto:contact@softlicense.com" :class="[
                  colorMode.value === 'dark' 
                    ? 'hover:text-primary-400' 
                    : 'hover:text-blue-600'
                ]">contact@softlicense.com</a>
              </li>
              <li :class="[
                colorMode.value === 'dark' 
                  ? 'text-gray-400' 
                  : 'text-gray-700'
              ]" class="flex items-center space-x-2">
                <Icon name="material-symbols:phone" class="w-5 h-5 text-blue-600" />
                <a href="tel:+1234567890" :class="[
                  colorMode.value === 'dark' 
                    ? 'hover:text-primary-400' 
                    : 'hover:text-blue-600'
                ]">+1 (234) 567-890</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div :class="[
          colorMode.value === 'dark' 
            ? 'border-gray-800 text-gray-400' 
            : 'border-gray-200 text-gray-600'
        ]" class="mt-12 pt-8 border-t text-center">
          <p>&copy; {{ new Date().getFullYear() }} SoftLicense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { onClickOutside } from '@vueuse/core';

const { locale } = useI18n();
const colorMode = useColorMode();
const userStore = useUserStore();
const router = useRouter();

// Check user authentication status on component mounted
onMounted(async () => {
  if (process.client) {
    // Nếu có token trong localStorage, thử lấy thông tin user
    const token = localStorage.getItem('access_token');
    if (token && !userStore.user) {
      await userStore.fetchUserInfo();
    }
  }
});

// Chức năng đăng xuất
const logout = async () => {
  userStore.logout();
  router.push('/');
};

// Dropdown menu cho user
const showUserMenu = ref(false);
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// Click outside để đóng dropdown
const userMenuRef = ref(null);
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false;
});

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

// User initial and name
const userInitial = computed(() => {
  if (userStore.user && userStore.user.name) {
    return userStore.user.name.charAt(0).toUpperCase();
  }
  return 'U';
});

const userName = computed(() => {
  if (userStore.user && userStore.user.name) {
    return userStore.user.name;
  }
  return 'User';
});

const userEmail = computed(() => {
  if (userStore.user && userStore.user.email) {
    return userStore.user.email;
  }
  return 'No email';
});

const userRoleDisplay = computed(() => {
  if (userStore.userRole) {
    return userStore.userRole.charAt(0).toUpperCase() + userStore.userRole.slice(1);
  }
  return 'User';
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style> 