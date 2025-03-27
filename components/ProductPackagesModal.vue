<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
    ></div>

    <!-- Modal -->
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <div
        class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 backdrop-blur-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6"
      >
        <!-- Close Button -->
        <div class="absolute right-0 top-0 pr-4 pt-4">
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <Icon name="material-symbols:close" class="w-6 h-6" />
          </button>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ product.name }} - {{ $t("products.choosePlan") }}
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            {{ $t("products.choosePlanDescription") }}
          </p>
        </div>

        <!-- Packages Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="pkg in packages" :key="pkg.id" class="relative group">
            <!-- Glow Effect -->
            <div
              class="absolute -inset-1 bg-blue-100 dark:bg-blue-900 opacity-0 blur group-hover:opacity-30 transition-opacity duration-500 rounded-xl"
            ></div>

            <!-- Package Content -->
            <div
              class="relative p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-all duration-300 h-full flex flex-col"
            >
              <!-- Package Name -->
              <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {{ pkg.name }}
              </h4>

              <!-- Price -->
              <div class="mb-4">
                <div class="flex items-baseline justify-center">
                  <div class="text-3xl font-bold text-gray-900 dark:text-white text-center truncate max-w-[180px]">
                    {{ formatPrice(pkg.price, pkg.price_unit) }}
                  </div>
                </div>
                <div class="text-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                  per {{ pkg.price_unit }}
                </div>
              </div>

              <!-- Features -->
              <ul class="space-y-3 mb-6 mt-2 flex-grow">
                <li class="flex items-center text-gray-700 dark:text-gray-300">
                  <Icon
                    name="material-symbols:devices"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0"
                  />
                  {{ pkg.limit_devices }} {{ $t("products.devices") }}
                </li>
                <li class="flex items-center text-gray-700 dark:text-gray-300">
                  <Icon
                    name="material-symbols:timer"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0"
                  />
                  {{ pkg.time_of_use }} {{ $t("products.timeOfUse") }}
                </li>
                <li class="flex items-center text-gray-700 dark:text-gray-300">
                  <Icon
                    name="material-symbols:verified"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0"
                  />
                  {{ $t("products.genuineLicense") }}
                </li>
              </ul>

              <!-- Action Button -->
              <button
                @click="handlePurchase(pkg)"
                :disabled="!pkg.is_active || pkg.status !== 'active'"
                class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 font-medium disabled:cursor-not-allowed"
              >
                {{
                  pkg.is_active && pkg.status === "active"
                    ? $t("products.buyNow")
                    : $t("products.unavailable")
                }}
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

const emit = defineEmits(["close", "purchase"]);

const closeModal = () => {
  emit("close");
};

// Format price with thousands separator
const formatPrice = (price: number, unit: string) => {
  // If VND, no decimal places and abbreviate large numbers
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
  
  // For USD and others, use 2 decimal places
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: unit,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

const handlePurchase = async (pkg: Package) => {
  try {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const { $auth } = useNuxtApp();
    const isLoggedIn = $auth.isAuthenticated();
    
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập với URL trả về
      const route = useRoute();
      navigateTo(`/auth/login?redirect=${route.fullPath}`);
      return;
    }

    closeModal(); // Đóng modal trước khi chuyển trang
    
    // Nếu đã đăng nhập, emit purchase event để xử lý thanh toán
    emit("purchase", pkg);
    
    // Chuyển hướng đến trang thanh toán với thông tin package
    navigateTo(`/checkout/${props.product.id}?package=${pkg.id}`);
  } catch (error) {
    console.error('Error in purchase flow:', error);
  }
};
</script>
