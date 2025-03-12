<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div class="relative transform overflow-hidden rounded-lg bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 backdrop-blur-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
        <!-- Close Button -->
        <div class="absolute right-0 top-0 pr-4 pt-4">
          <button @click="closeModal" class="text-gray-400 hover:text-white">
            <Icon name="material-symbols:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-white">
            {{ product.name }} - {{ $t('products.choosePlan') }}
          </h3>
          <p class="mt-2 text-gray-300">{{ $t('products.choosePlanDescription') }}</p>
        </div>

        <!-- Packages Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="pkg in packages" :key="pkg.id" 
               class="relative group">
            <!-- Glow Effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-neon-purple opacity-30 blur group-hover:opacity-50 transition-opacity duration-500 rounded-xl"></div>
            
            <!-- Package Content -->
            <div class="relative p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 group-hover:border-primary-500/50 transition-all duration-300">
              <!-- Package Name -->
              <h4 class="text-xl font-semibold text-white mb-4">{{ pkg.name }}</h4>
              
              <!-- Price -->
              <div class="mb-4">
                <div class="flex items-baseline justify-center">
                  <span class="text-4xl font-bold text-white">${{ pkg.price }}</span>
                  <span class="text-gray-400 ml-2">/{{ pkg.price_unit }}</span>
                </div>
              </div>

              <!-- Features -->
              <ul class="space-y-3 mb-6">
                <li class="flex items-center text-gray-300">
                  <Icon name="material-symbols:devices" class="w-5 h-5 text-primary-400 mr-2" />
                  {{ pkg.limit_devices }} {{ $t('products.devices') }}
                </li>
                <li class="flex items-center text-gray-300">
                  <Icon name="material-symbols:timer" class="w-5 h-5 text-primary-400 mr-2" />
                  {{ pkg.time_of_use }} {{ $t('products.timeOfUse') }}
                </li>
                <li class="flex items-center text-gray-300">
                  <Icon name="material-symbols:verified" class="w-5 h-5 text-primary-400 mr-2" />
                  {{ $t('products.genuineLicense') }}
                </li>
              </ul>

              <!-- Action Button -->
              <button @click="handlePurchase(pkg)"
                      :disabled="!pkg.is_active || pkg.status !== 'active'"
                      class="w-full px-4 py-2 bg-primary-500 hover:bg-primary-400 disabled:bg-gray-600 
                             text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200
                             shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]
                             disabled:transform-none disabled:shadow-none">
                {{ pkg.is_active && pkg.status === 'active' 
                   ? $t('products.buyNow') 
                   : $t('products.unavailable') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Package {
  id: number;
  product_id: number;
  name: string;
  price: number;
  price_unit: string;
  limit_devices: number;
  time_of_use: number;
  is_active: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  name: string;
  // ... other product properties
}

const props = defineProps<{
  show: boolean;
  product: Product;
  packages: Package[];
}>();

const emit = defineEmits(['close', 'purchase']);

const closeModal = () => {
  emit('close');
};

const handlePurchase = async (pkg: Package) => {
  // Check if user is logged in
  const user = useSupabaseUser();
  
  if (!user.value) {
    // If not logged in, redirect to login page with return URL
    const route = useRoute();
    navigateTo(`/auth/login?redirect=${route.fullPath}`);
    return;
  }

  // If logged in, emit purchase event
  emit('purchase', pkg);
};
</script> 