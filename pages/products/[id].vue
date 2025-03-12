<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden"
  >
    <div v-if="product">
      <!-- Product Hero -->
      <div class="relative">
        <!-- Background Effects -->
        <div
          class="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20"
        ></div>
        <div
          class="absolute inset-0 bg-gradient-conic from-primary-500/20 via-transparent to-neon-purple/20 opacity-30"
        ></div>

        <div class="container mx-auto px-4 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Product Image -->
            <div class="relative group">
              <div class="relative rounded-xl overflow-hidden">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"
                ></div>
              </div>
              <!-- Glow Effect -->
              <div
                class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-neon-purple opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"
              ></div>
            </div>

            <!-- Product Info -->
            <div class="relative z-10">
              <div class="animate-float">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                  <span
                    class="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-primary-400"
                  >
                    {{ product.name }}
                  </span>
                </h1>
                <div class="space-y-6">
                  <p class="text-gray-300 text-lg leading-relaxed">
                    {{ product.description }}
                  </p>
                  <div class="flex items-center gap-4">
                    <span class="text-3xl font-bold text-white"
                      >${{ product.price }}</span
                    >
                    <span
                      class="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30"
                    >
                      {{ product.license }}
                    </span>
                  </div>

                  <!-- Features -->
                  <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-white">
                      {{ $t('products.keyFeatures') }}
                    </h3>
                    <ul class="space-y-3">
                      <li
                        v-for="feature in product.features"
                        :key="feature"
                        class="flex items-center gap-3 text-gray-300"
                      >
                        <Icon
                          name="material-symbols:check-circle-outline"
                          class="w-5 h-5 text-primary-400"
                        />
                        {{ feature }}
                      </li>
                    </ul>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-4 pt-6">
                    <button
                      @click="showPackagesModal = true"
                      class="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200 shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]"
                    >
                      {{ $t('products.choosePlan') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Specs -->
      <div class="container mx-auto px-4 py-16">
        <div class="relative">
          <div
            class="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent"
          ></div>
          <div class="relative glass-card p-8">
            <h2 class="text-2xl font-bold text-white mb-8">
              {{ $t('products.technicalSpecs') }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                v-for="(spec, index) in product.specifications"
                :key="index"
                class="space-y-2"
              >
                <h3 class="text-primary-400 font-semibold">{{ spec.title }}</h3>
                <p class="text-gray-300">{{ spec.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Packages Modal -->
      <ProductPackagesModal
        v-if="packages"
        :show="showPackagesModal"
        :product="product"
        :packages="packages"
        @close="showPackagesModal = false"
        @purchase="handlePurchase"
      />
    </div>

    <!-- Not Found State -->
    <div v-else class="container mx-auto px-4 py-12 text-center">
      <Icon
        name="material-symbols:error"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      />
      <h2 class="text-2xl font-bold mb-2">{{ $t('products.notFound.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        {{ $t('products.notFound.description') }}
      </p>
      <NuxtLink
        to="/products"
        class="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-lg inline-block"
      >
        {{ $t('products.notFound.browseProducts') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showPackagesModal = ref(false);
const route = useRoute();
const { $supabase } = useNuxtApp();

interface Specification {
  title: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  license: string;
  image: string;
  features: string[];
  specifications: Specification[];
}

interface Package {
  id: number;
  product_id: number;
  name: string;
  price: number;
  price_unit: string;
  limit_devices: number | string;
  time_of_use: string;
  is_active: boolean;
  status: string;
}

// Fetch product and packages data
const { data: product, error: productError } = await useFetch<Product>(`/api/products/${route.params.id}`);
const { data: packages, error: packagesError } = await useFetch<Package[]>(`/api/products/${route.params.id}/packages`);

// Handle purchase
const handlePurchase = async (pkg: Package) => {
  try {
    // Check if user is logged in
    const user = useSupabaseUser();
    
    if (!user.value) {
      // If not logged in, redirect to login page with return URL
      navigateTo(`/auth/login?redirect=${route.fullPath}`);
      return;
    }

    // Create order in database
    const { data, error } = await $supabase
      .from('orders')
      .insert({
        user_id: user.value.id,
        product_id: product.value?.id,
        package_id: pkg.id,
        status: 'pending',
        amount: pkg.price
      })
      .select()
      .single();

    if (error) throw error;

    // Redirect to payment page
    navigateTo(`/payment/${data.id}`);
  } catch (error) {
    console.error('Error creating order:', error);
    // Handle error (show notification, etc.)
  }
};
</script>

<style scoped>
.glass-card {
  background: linear-gradient(to bottom right, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.5));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(75, 85, 99, 0.2);
  border-radius: 1rem;
}
</style>
