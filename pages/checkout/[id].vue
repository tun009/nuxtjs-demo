<template>
  <div
    :class="[
      colorMode.value === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-black'
        : 'bg-gray-50',
    ]"
    class="min-h-screen"
  >
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1
            :class="[
              colorMode.value === 'dark' 
                ? 'text-white'
                : 'text-gray-900',
            ]"
            class="text-3xl font-bold mb-2"
          >
            {{ $t('checkout.title') }}
          </h1>
          <p
            :class="[
              colorMode.value === 'dark' 
                ? 'text-gray-300'
                : 'text-gray-600',
            ]"
          >
            {{ $t('checkout.subtitle') }}
          </p>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Summary -->
          <div class="lg:col-span-2">
            <div
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200',
              ]"
              class="rounded-lg border shadow-sm p-6 mb-6"
            >
              <h2
                :class="[
                  colorMode.value === 'dark' 
                    ? 'text-white border-gray-700'
                    : 'text-gray-900 border-gray-200',
                ]"
                class="text-xl font-semibold mb-4 pb-4 border-b"
              >
                {{ $t('checkout.orderSummary') }}
              </h2>

              <!-- Loading State -->
              <div v-if="loading" class="py-8 text-center">
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
                      ? 'text-gray-400'
                      : 'text-gray-500',
                  ]"
                  class="mt-4"
                >
                  {{ $t('checkout.loading') }}
                </p>
              </div>

              <!-- Product & Package Info -->
              <div v-else-if="product && selectedPackage" class="space-y-6">
                <!-- Product Info -->
                <div class="flex gap-4">
                  <div class="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                    <img
                      :src="product.thumbnail"
                      :alt="product.name"
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
                      class="font-semibold"
                    >
                      {{ product.name }}
                    </h3>
                    <p
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-gray-400'
                          : 'text-gray-500',
                      ]"
                      class="text-sm mb-2"
                    >
                      {{ product.version }}
                    </p>
                    <div class="flex items-center">
                      <Icon
                        name="material-symbols:verified"
                        :class="[
                          colorMode.value === 'dark' 
                            ? 'text-blue-400'
                            : 'text-blue-600',
                        ]"
                        class="w-4 h-4 mr-1"
                      />
                      <span
                        :class="[
                          colorMode.value === 'dark' 
                            ? 'text-gray-300'
                            : 'text-gray-700',
                        ]"
                        class="text-sm"
                      >
                        {{ $t('checkout.officialProduct') }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Package Details -->
                <div
                  :class="[
                    colorMode.value === 'dark' 
                      ? 'bg-gray-700/50 border-gray-600'
                      : 'bg-gray-50 border-gray-200',
                  ]"
                  class="p-4 rounded-lg border"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h4
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                      class="font-medium"
                    >
                      {{ selectedPackage.name }}
                    </h4>
                    <span
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                      class="font-bold"
                    >
                      {{ formatPrice(selectedPackage.price, selectedPackage.price_unit) }}
                    </span>
                  </div>
                  <ul class="space-y-2">
                    <li
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-gray-300'
                          : 'text-gray-700',
                      ]"
                      class="flex items-center text-sm"
                    >
                      <Icon name="material-symbols:devices" class="w-4 h-4 mr-2" />
                      {{ selectedPackage.limit_devices }} {{ $t('products.devices') }}
                    </li>
                    <li
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-gray-300'
                          : 'text-gray-700',
                      ]"
                      class="flex items-center text-sm"
                    >
                      <Icon name="material-symbols:timer" class="w-4 h-4 mr-2" />
                      {{ selectedPackage.time_of_use }} {{ $t('products.timeOfUse') }}
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="py-8 text-center">
                <Icon
                  name="material-symbols:error"
                  :class="[
                    colorMode.value === 'dark' 
                      ? 'text-red-400'
                      : 'text-red-500',
                  ]"
                  class="w-12 h-12 mx-auto mb-4"
                />
                <p
                  :class="[
                    colorMode.value === 'dark' 
                      ? 'text-red-400'
                      : 'text-red-600',
                  ]"
                >
                  {{ error }}
                </p>
                <button
                  @click="fetchData"
                  class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  {{ $t('checkout.tryAgain') }}
                </button>
              </div>
            </div>

            <!-- Payment Methods -->
            <div
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200',
              ]"
              class="rounded-lg border shadow-sm p-6"
            >
              <h2
                :class="[
                  colorMode.value === 'dark' 
                    ? 'text-white border-gray-700'
                    : 'text-gray-900 border-gray-200',
                ]"
                class="text-xl font-semibold mb-4 pb-4 border-b"
              >
                {{ $t('checkout.paymentMethod') }}
              </h2>

              <!-- Payment Options -->
              <div class="space-y-4">
                <label
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500/50'
                      : 'bg-white border-gray-200 hover:border-blue-500/50',
                    paymentMethod === 'creditCard' ? 'border-blue-500' : '',
                  ]"
                  class="flex items-center p-4 rounded-lg border cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    v-model="paymentMethod"
                    class="mr-3"
                  />
                  <div class="flex items-center">
                    <Icon name="material-symbols:credit-card" class="w-6 h-6 mr-3 text-blue-500" />
                    <span
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                    >
                      {{ $t('checkout.creditCard') }}
                    </span>
                  </div>
                </label>

                <label
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500/50'
                      : 'bg-white border-gray-200 hover:border-blue-500/50',
                    paymentMethod === 'paypal' ? 'border-blue-500' : '',
                  ]"
                  class="flex items-center p-4 rounded-lg border cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    v-model="paymentMethod"
                    class="mr-3"
                  />
                  <div class="flex items-center">
                    <Icon name="logos:paypal" class="w-6 h-6 mr-3" />
                    <span
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                    >
                      PayPal
                    </span>
                  </div>
                </label>

                <label
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500/50'
                      : 'bg-white border-gray-200 hover:border-blue-500/50',
                    paymentMethod === 'bankTransfer' ? 'border-blue-500' : '',
                  ]"
                  class="flex items-center p-4 rounded-lg border cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bankTransfer"
                    v-model="paymentMethod"
                    class="mr-3"
                  />
                  <div class="flex items-center">
                    <Icon name="material-symbols:account-balance" class="w-6 h-6 mr-3 text-green-500" />
                    <span
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                    >
                      {{ $t('checkout.bankTransfer') }}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Order Total -->
          <div class="lg:col-span-1">
            <div
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200',
              ]"
              class="rounded-lg border shadow-sm p-6 sticky top-6"
            >
              <h2
                :class="[
                  colorMode.value === 'dark' 
                    ? 'text-white border-gray-700'
                    : 'text-gray-900 border-gray-200',
                ]"
                class="text-xl font-semibold mb-4 pb-4 border-b"
              >
                {{ $t('checkout.orderTotal') }}
              </h2>

              <div class="space-y-4">
                <!-- Subtotal -->
                <div class="flex justify-between">
                  <span
                    :class="[
                      colorMode.value === 'dark' 
                        ? 'text-gray-300'
                        : 'text-gray-600',
                    ]"
                  >
                    {{ $t('checkout.subtotal') }}
                  </span>
                  <span
                    :class="[
                      colorMode.value === 'dark' 
                        ? 'text-white'
                        : 'text-gray-900',
                    ]"
                  >
                    {{ selectedPackage ? formatPrice(selectedPackage.price, selectedPackage.price_unit) : '-' }}
                  </span>
                </div>

                <!-- VAT -->
                <div class="flex justify-between">
                  <span
                    :class="[
                      colorMode.value === 'dark' 
                        ? 'text-gray-300'
                        : 'text-gray-600',
                    ]"
                  >
                    {{ $t('checkout.vat') }} (10%)
                  </span>
                  <span
                    :class="[
                      colorMode.value === 'dark' 
                        ? 'text-white'
                        : 'text-gray-900',
                    ]"
                  >
                    {{ selectedPackage ? formatPrice(selectedPackage.price * 0.1, selectedPackage.price_unit) : '-' }}
                  </span>
                </div>

                <!-- Total -->
                <div
                  :class="[
                    colorMode.value === 'dark' 
                      ? 'border-gray-700'
                      : 'border-gray-200',
                  ]"
                  class="pt-4 border-t"
                >
                  <div class="flex justify-between items-center">
                    <span
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                      class="font-semibold"
                    >
                      {{ $t('checkout.total') }}
                    </span>
                    <span
                      :class="[
                        colorMode.value === 'dark' 
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                      class="text-xl font-bold"
                    >
                      {{ selectedPackage ? formatPrice(selectedPackage.price * 1.1, selectedPackage.price_unit) : '-' }}
                    </span>
                  </div>
                </div>

                <!-- Place Order Button -->
                <button
                  @click="placeOrder"
                  :disabled="!selectedPackage || !paymentMethod || isProcessing"
                  class="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="isProcessing">
                    <Icon name="material-symbols:sync" class="animate-spin inline-block mr-2" />
                    {{ $t('checkout.processing') }}
                  </span>
                  <span v-else>{{ $t('checkout.placeOrder') }}</span>
                </button>
              </div>

              <!-- Secure Checkout -->
              <div class="mt-6 text-center">
                <div class="flex justify-center items-center mb-2">
                  <Icon name="material-symbols:lock" class="w-4 h-4 mr-1 text-green-500" />
                  <span
                    :class="[
                      colorMode.value === 'dark' 
                        ? 'text-gray-300'
                        : 'text-gray-700',
                    ]"
                    class="text-sm"
                  >
                    {{ $t('checkout.secureCheckout') }}
                  </span>
                </div>
                <div class="flex justify-center space-x-2">
                  <Icon name="logos:visa" class="h-6" />
                  <Icon name="logos:mastercard" class="h-6" />
                  <Icon name="logos:paypal" class="h-6" />
                </div>
              </div>
            </div>
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

// Lấy ID sản phẩm và ID gói từ URL
const productId = route.params.id;
const packageId = route.query.package;

// State
const loading = ref(true);
const error = ref(null);
const product = ref(null);
const selectedPackage = ref(null);
const paymentMethod = ref('creditCard');
const isProcessing = ref(false);

// Lấy dữ liệu sản phẩm và gói
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Lấy thông tin sản phẩm
    const productResponse = await $api.get(`/api/products/${productId}`);
    if (!productResponse.data) {
      throw new Error('Product not found');
    }
    product.value = productResponse.data;

    // Tìm gói đã chọn
    if (product.value.packages && Array.isArray(product.value.packages)) {
      selectedPackage.value = product.value.packages.find(pkg => pkg.id.toString() === packageId);
    }

    if (!selectedPackage.value) {
      throw new Error('Selected package not found');
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err.message || 'Failed to load checkout data';
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

// Xử lý đặt hàng
const placeOrder = async () => {
  if (!selectedPackage.value || !paymentMethod.value) return;
  
  isProcessing.value = true;
  try {
    // Tạo đơn hàng
    const orderData = {
      product_id: product.value.id,
      package_id: selectedPackage.value.id,
      payment_method: paymentMethod.value,
      amount: selectedPackage.value.price * 1.1,
      currency: selectedPackage.value.price_unit
    };
    
    const response = await $api.post('/api/orders', orderData);
    
    if (response.data && response.data.id) {
      // Chuyển hướng đến trang xác nhận đơn hàng
      navigateTo(`/order/confirmation/${response.data.id}`);
    } else {
      throw new Error('Failed to create order');
    }
  } catch (err) {
    console.error('Error creating order:', err);
    // Hiển thị thông báo lỗi
    alert(err.message || 'There was an error processing your order. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

// Lấy dữ liệu khi trang được tải
onMounted(() => {
  fetchData();
});
</script> 