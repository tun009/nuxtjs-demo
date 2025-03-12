<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
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
          <NuxtLink to="/" class="text-gray-300 hover:text-white transition-colors">
            {{ $t('common.home') }}
          </NuxtLink>
          <NuxtLink to="/products" class="text-gray-300 hover:text-white transition-colors">
            {{ $t('common.products') }}
          </NuxtLink>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <select v-model="locale" class="bg-transparent text-gray-300 border border-gray-700 rounded-lg px-2 py-1">
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
          </select>

          <!-- Theme Toggle -->
          <button @click="toggleColorMode" class="text-gray-300 hover:text-white">
            <Icon v-if="colorMode.value === 'dark'" name="material-symbols:dark-mode" class="w-6 h-6" />
            <Icon v-else name="material-symbols:light-mode" class="w-6 h-6" />
          </button>

          <!-- Auth -->
          <div class="flex items-center space-x-2">
            <NuxtLink to="/auth/login" class="text-white bg-primary-500 hover:bg-primary-400 px-4 py-2 rounded-lg transition-colors">
              {{ $t('common.login') }}
            </NuxtLink>
            <NuxtLink to="/auth/register" class="text-primary-400 border border-primary-500/50 hover:border-primary-400 px-4 py-2 rounded-lg transition-colors">
              {{ $t('common.register') }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow pt-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900/80 border-t border-gray-800 py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">SoftLicense</h3>
            <p class="text-gray-400">
              Your trusted source for premium software licenses.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-primary-400">
                <Icon name="mdi:facebook" class="w-6 h-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-400">
                <Icon name="mdi:twitter" class="w-6 h-6" />
              </a>
              <a href="#" class="text-gray-400 hover:text-primary-400">
                <Icon name="mdi:linkedin" class="w-6 h-6" />
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/about" class="text-gray-400 hover:text-primary-400">About Us</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/products" class="text-gray-400 hover:text-primary-400">Products</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/pricing" class="text-gray-400 hover:text-primary-400">Pricing</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-gray-400 hover:text-primary-400">Contact</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Support</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/faq" class="text-gray-400 hover:text-primary-400">FAQ</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/documentation" class="text-gray-400 hover:text-primary-400">Documentation</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/terms" class="text-gray-400 hover:text-primary-400">Terms of Service</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/privacy" class="text-gray-400 hover:text-primary-400">Privacy Policy</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Contact Us</h3>
            <ul class="space-y-2">
              <li class="flex items-center space-x-2 text-gray-400">
                <Icon name="material-symbols:location-on" class="w-5 h-5 text-primary-400" />
                <span>123 Software Street, Digital City</span>
              </li>
              <li class="flex items-center space-x-2 text-gray-400">
                <Icon name="material-symbols:mail" class="w-5 h-5 text-primary-400" />
                <a href="mailto:contact@softlicense.com" class="hover:text-primary-400">
                  contact@softlicense.com
                </a>
              </li>
              <li class="flex items-center space-x-2 text-gray-400">
                <Icon name="material-symbols:phone" class="w-5 h-5 text-primary-400" />
                <a href="tel:+1234567890" class="hover:text-primary-400">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} SoftLicense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
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