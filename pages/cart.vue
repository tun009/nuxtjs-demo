<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">{{ $t('common.cart') }}</h1>

    <div v-if="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="glass-card p-4 rounded-xl"
        >
          <div class="flex items-start space-x-4">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-24 h-24 object-cover rounded-lg"
            />
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-lg">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ item.licenseType }}
                  </p>
                </div>
                <button
                  @click="removeFromCart(item)"
                  class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Icon name="material-symbols:delete" class="w-5 h-5" />
                </button>
              </div>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <button
                    @click="decreaseQuantity(item)"
                    class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    :disabled="item.quantity <= 1"
                  >
                    <Icon name="material-symbols:remove" class="w-5 h-5" />
                  </button>
                  <span class="w-8 text-center">{{ item.quantity }}</span>
                  <button
                    @click="increaseQuantity(item)"
                    class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Icon name="material-symbols:add" class="w-5 h-5" />
                  </button>
                </div>
                <span class="font-bold text-lg text-primary-600 dark:text-primary-400">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="glass-card p-6 rounded-xl h-fit space-y-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('cart.total') }}</h2>
        
        <!-- Summary Items -->
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>Tax (10%)</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>
          <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span class="text-primary-600 dark:text-primary-400">
                ${{ total.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Promo Code -->
        <div>
          <label class="block text-sm font-medium mb-2">
            Promo Code
          </label>
          <div class="flex space-x-2">
            <input
              v-model="promoCode"
              type="text"
              placeholder="Enter code"
              class="flex-1 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              @click="applyPromoCode"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        <!-- Checkout Button -->
        <button
          @click="checkout"
          class="btn-gradient w-full py-3 text-lg font-semibold"
        >
          {{ $t('cart.checkout') }}
        </button>
      </div>
    </div>

    <!-- Empty Cart -->
    <div
      v-else
      class="text-center py-12"
    >
      <Icon
        name="material-symbols:shopping-cart"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      />
      <h2 class="text-2xl font-bold mb-2">{{ $t('cart.empty') }}</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Add some products to your cart and they will appear here
      </p>
      <NuxtLink
        to="/products"
        class="btn-gradient px-6 py-2 inline-block"
      >
        {{ $t('common.products') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const promoCode = ref('')

// Sample data - Replace with state management
const cartItems = ref([
  {
    id: 1,
    name: 'Pro Video Editor',
    licenseType: 'Professional License',
    price: 199.99,
    quantity: 1,
    image: '/images/product-1.jpg'
  },
  {
    id: 2,
    name: 'Data Recovery Pro',
    licenseType: 'Standard License',
    price: 79.99,
    quantity: 2,
    image: '/images/product-2.jpg'
  }
])

// Computed values
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + tax.value)

// Methods
const removeFromCart = (item) => {
  const index = cartItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

const increaseQuantity = (item) => {
  item.quantity++
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const applyPromoCode = () => {
  // Implement promo code logic
  console.log('Applying promo code:', promoCode.value)
}

const checkout = () => {
  // Implement checkout logic
  console.log('Proceeding to checkout with items:', cartItems.value)
}
</script> 