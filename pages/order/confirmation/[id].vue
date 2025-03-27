<template>
  <div
    :class="[
      colorMode.value === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-black'
        : 'bg-gray-50',
    ]"
    class="min-h-screen"
  >
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-3xl mx-auto">
        <!-- Success Card -->
        <div
          v-if="order && !error"
          :class="[
            colorMode.value === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
          class="rounded-xl border shadow-lg p-8 text-center"
        >
          <!-- Success Icon -->
          <div class="mb-6">
            <div
              class="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-green-600/20'
                  : 'bg-green-100',
              ]"
            >
              <Icon
                name="material-symbols:check-circle"
                :class="[
                  colorMode.value === 'dark'
                    ? 'text-green-400'
                    : 'text-green-600',
                ]"
                class="w-12 h-12"
              />
            </div>
          </div>

          <!-- Confirmation Message -->
          <h1
            :class="[
              colorMode.value === 'dark' ? 'text-white' : 'text-gray-900',
            ]"
            class="text-3xl font-bold mb-3"
          >
            {{ $t('order.confirmationTitle') }}
          </h1>
          <p
            :class="[
              colorMode.value === 'dark' ? 'text-gray-300' : 'text-gray-600',
            ]"
            class="text-lg mb-6"
          >
            {{ $t('order.confirmationMessage') }}
          </p>

          <!-- Order Details -->
          <div 
            :class="[
              colorMode.value === 'dark'
                ? 'bg-gray-700/50 border-gray-700'
                : 'bg-gray-50 border-gray-200',
            ]"
            class="rounded-lg border p-6 mb-8 text-left"
          >
            <div class="mb-4">
              <h2
                :class="[
                  colorMode.value === 'dark'
                    ? 'text-white border-gray-700'
                    : 'text-gray-900 border-gray-200',
                ]"
                class="text-xl font-semibold mb-4 pb-4 border-b"
              >
                {{ $t('order.orderDetails') }}
              </h2>
            </div>

            <!-- Order Info -->
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-500',
                  ]"
                  class="text-sm"
                >
                  {{ $t('order.orderNumber') }}
                </dt>
                <dd
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-white'
                      : 'text-gray-900',
                  ]"
                  class="text-lg font-medium"
                >
                  #{{ order.id }}
                </dd>
              </div>

              <div>
                <dt
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-500',
                  ]"
                  class="text-sm"
                >
                  {{ $t('order.date') }}
                </dt>
                <dd
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-white'
                      : 'text-gray-900',
                  ]"
                  class="text-lg font-medium"
                >
                  {{ new Date(order.created_at).toLocaleDateString() }}
                </dd>
              </div>

              <div>
                <dt
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-500',
                  ]"
                  class="text-sm"
                >
                  {{ $t('order.paymentMethod') }}
                </dt>
                <dd
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-white'
                      : 'text-gray-900',
                  ]"
                  class="text-lg font-medium flex items-center"
                >
                  <template v-if="order.payment_method === 'creditCard'">
                    <Icon name="material-symbols:credit-card" class="w-5 h-5 mr-2 text-blue-500" />
                    {{ $t('checkout.creditCard') }}
                  </template>
                  <template v-else-if="order.payment_method === 'paypal'">
                    <Icon name="logos:paypal" class="w-5 h-5 mr-2" />
                    PayPal
                  </template>
                  <template v-else-if="order.payment_method === 'bankTransfer'">
                    <Icon name="material-symbols:account-balance" class="w-5 h-5 mr-2 text-green-500" />
                    {{ $t('checkout.bankTransfer') }}
                  </template>
                  <template v-else>{{ order.payment_method }}</template>
                </dd>
              </div>

              <div>
                <dt
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-500',
                  ]"
                  class="text-sm"
                >
                  {{ $t('order.totalAmount') }}
                </dt>
                <dd
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-white'
                      : 'text-gray-900',
                  ]"
                  class="text-lg font-bold"
                >
                  {{ formatPrice(order.amount, order.currency) }}
                </dd>
              </div>
            </dl>

            <div 
              v-if="order.product"
              class="mt-6 pt-6 border-t"
              :class="[
                colorMode.value === 'dark'
                  ? 'border-gray-700'
                  : 'border-gray-200',
              ]"
            >
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                  <img
                    :src="order.product.thumbnail"
                    :alt="order.product.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-grow">
                  <h3
                    :class="[
                      colorMode.value === 'dark'
                        ? 'text-white'
                        : 'text-gray-900',
                    ]"
                    class="font-medium"
                  >
                    {{ order.product.name }}
                  </h3>
                  <p
                    :class="[
                      colorMode.value === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500',
                    ]"
                    class="text-sm"
                  >
                    {{ order.package ? order.package.name : '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink
              to="/dashboard"
              class="px-6 py-3 rounded-lg font-medium text-center"
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white',
              ]"
            >
              {{ $t('order.viewDashboard') }}
            </NuxtLink>
            
            <NuxtLink
              to="/products"
              class="px-6 py-3 rounded-lg font-medium text-center"
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700',
              ]"
            >
              {{ $t('order.continueShopping') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Loading State -->
        <div 
          v-else-if="loading"
          :class="[
            colorMode.value === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
          class="rounded-xl border shadow-lg p-8 text-center"
        >
          <div class="py-8">
            <div
              :class="[
                colorMode.value === 'dark' 
                  ? 'border-blue-500'
                  : 'border-blue-600',
              ]"
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mx-auto"
            ></div>
            <p
              :class="[
                colorMode.value === 'dark' 
                  ? 'text-gray-300'
                  : 'text-gray-600',
              ]"
              class="mt-4 text-lg"
            >
              {{ $t('order.loadingOrderDetails') }}
            </p>
          </div>
        </div>

        <!-- Error State -->
        <div 
          v-else
          :class="[
            colorMode.value === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
          class="rounded-xl border shadow-lg p-8 text-center"
        >
          <div class="mb-6">
            <div
              class="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-red-500/20'
                  : 'bg-red-100',
              ]"
            >
              <Icon
                name="material-symbols:error"
                :class="[
                  colorMode.value === 'dark'
                    ? 'text-red-400'
                    : 'text-red-600',
                ]"
                class="w-12 h-12"
              />
            </div>
          </div>

          <h1
            :class="[
              colorMode.value === 'dark' ? 'text-white' : 'text-gray-900',
            ]"
            class="text-2xl font-bold mb-3"
          >
            {{ $t('order.errorTitle') }}
          </h1>
          <p
            :class="[
              colorMode.value === 'dark' ? 'text-red-400' : 'text-red-600',
            ]"
            class="mb-6"
          >
            {{ error }}
          </p>

          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button
              @click="fetchOrder"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              {{ $t('order.tryAgain') }}
            </button>
            
            <NuxtLink
              to="/products"
              class="px-6 py-3 rounded-lg font-medium text-center"
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100 text-gray-700',
              ]"
            >
              {{ $t('order.backToProducts') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const colorMode = useColorMode();
const route = useRoute();
const { $api } = useNuxtApp();

// Lấy ID đơn hàng từ URL
const orderId = route.params.id;

// State
const loading = ref(true);
const error = ref(null);
const order = ref(null);

// Lấy thông tin đơn hàng
const fetchOrder = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $api.get(`/api/orders/${orderId}`);
    if (!response.data) {
      throw new Error('Order not found');
    }
    order.value = response.data;
  } catch (err) {
    console.error('Error fetching order:', err);
    error.value = err.message || 'Failed to load order details';
  } finally {
    loading.value = false;
  }
};

// Format giá tiền
const formatPrice = (price, unit) => {
  // Nếu là VND, không có phần thập phân và rút gọn số lớn
  if (unit === "VND") {
    if (price >= 1000000000) {
      return new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 1,
      }).format(price / 1000000000) + " tỷ";
    } else if (price >= 1000000) {
      return new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 1,
      }).format(price / 1000000) + " tr";
    }
    return new Intl.NumberFormat("vi-VN").format(price);
  }
  
  // Đối với USD và các loại tiền khác, sử dụng 2 số thập phân
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: unit,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

// Lấy dữ liệu khi trang được tải
onMounted(() => {
  fetchOrder();
});
</script> 