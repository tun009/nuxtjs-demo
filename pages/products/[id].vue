<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden"
  >
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
                class="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
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
                  <h3 class="text-xl font-semibold text-white">Key Features</h3>
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
                    @click="addToCart"
                    class="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200 shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]"
                  >
                    {{ $t("product.addToCart") }}
                  </button>
                  <button
                    @click="buyNow"
                    class="px-6 py-3 border border-primary-500/50 hover:border-primary-400 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200 hover:bg-primary-500/10"
                  >
                    {{ $t("product.buyNow") }}
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
            Technical Specifications
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
  </div>
  <div v-if="!product" class="container mx-auto px-4 py-12 text-center">
    <Icon
      name="material-symbols:error"
      class="w-16 h-16 mx-auto text-gray-400 mb-4"
    />
    <h2 class="text-2xl font-bold mb-2">Product Not Found</h2>
    <p class="text-gray-600 dark:text-gray-300 mb-6">
      The product you're looking for doesn't exist or has been removed.
    </p>
    <NuxtLink to="/products" class="btn-gradient px-6 py-2 inline-block">
      Browse Products
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const id = parseInt(route.params.id as string);

// Sample product data - Replace with API call
const product = ref({
  id: id,
  name: "Pro Video Editor",
  description:
    "Experience professional-grade video editing with our cutting-edge software. Designed for both beginners and experts, this powerful tool offers an intuitive interface combined with advanced features to bring your creative vision to life.",
  price: 99.99,
  license: "Lifetime License",
  image:
    "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  features: [
    "Advanced Timeline Editing",
    "Professional Effects Library",
    "Real-time Preview",
    "4K/8K Resolution Support",
    "AI-Powered Tools",
    "Cloud Backup Integration",
  ],
  specifications: [
    {
      title: "System Requirements",
      description: "Windows 10/11 or macOS 11+, 16GB RAM, 4GB VRAM",
    },
    {
      title: "Supported Formats",
      description: "MP4, MOV, AVI, MKV, and 50+ more formats",
    },
    {
      title: "Cloud Integration",
      description: "Google Drive, Dropbox, OneDrive support",
    },
    {
      title: "Updates",
      description: "Free updates for 1 year",
    },
  ],
});

const addToCart = () => {
  // Implement add to cart logic
};

const buyNow = () => {
  // Implement buy now logic
};
</script>
