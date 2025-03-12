<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
    <!-- Hero Section -->
    <div class="relative h-[40vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20"></div>
      <div class="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent"></div>
      <div class="relative text-center z-10">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-primary-400 to-neon-purple">
            {{ $t('products.title') }}
          </span>
        </h1>
        <p class="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          {{ $t('products.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="product in products" :key="product.id" 
             class="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <!-- Product Image -->
          <div class="relative h-48 overflow-hidden">
            <img :src="product.image" :alt="product.name" 
                 class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
          </div>

          <!-- Product Info -->
          <div class="p-6 relative">
            <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-gray-400 mb-4 line-clamp-2">
              {{ product.description }}
            </p>
            
            <!-- Price and Action -->
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-white">
                ${{ product.price }}
              </span>
              <NuxtLink :to="'/products/' + product.id" 
                        class="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-lg 
                               transform hover:-translate-y-1 transition-all duration-200
                               shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]">
                {{ $t('common.learnMore') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = ref([
  {
    id: 1,
    name: 'Pro Video Editor',
    description: 'Professional video editing software with advanced features.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Data Recovery Pro',
    description: 'Recover lost files with our powerful recovery tool.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Security Suite',
    description: 'Complete protection for your digital life.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
])
</script> 