<template>
  <div
    class="min-h-screen overflow-hidden"
    :class="[
      colorMode.value === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-black'
        : 'bg-white',
    ]"
  >
    <div v-if="product">
      <!-- Product Hero -->
      <div class="relative">
        <!-- Background Effects -->
        <div
          :class="[
            colorMode.value === 'dark'
              ? 'bg-cyber-grid bg-[length:50px_50px] opacity-20'
              : 'bg-blue-50',
          ]"
          class="absolute inset-0"
        ></div>
        <div
          :class="[
            colorMode.value === 'dark'
              ? 'bg-gradient-conic from-primary-500/20 via-transparent to-neon-purple/20 opacity-30'
              : 'bg-gradient-conic from-blue-300/30 via-blue-100/20 to-transparent opacity-30',
          ]"
          class="absolute inset-0"
        ></div>

        <div class="container mx-auto px-4 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Product Image with Side Info -->
            <div class="space-y-6">
              <!-- Main Image -->
              <div class="relative group">
                <div class="relative rounded-xl overflow-hidden shadow-2xl">
                  <img
                    :src="product.thumbnail"
                    :alt="product.name"
                    class="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"
                  ></div>
                </div>
                <!-- Glow Effect -->
                <div
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gradient-to-r from-primary-500 to-neon-purple opacity-30 blur-xl group-hover:opacity-50'
                      : 'bg-gradient-to-r from-blue-500 to-blue-300 opacity-20 blur-xl group-hover:opacity-40',
                  ]"
                  class="absolute -inset-1 transition-opacity duration-500"
                ></div>
              </div>

              <!-- Keywords Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="keyword in product.post?.keywords.split(',')"
                  :key="keyword"
                  :class="[
                    colorMode.value === 'dark'
                      ? 'bg-gray-800/80 text-gray-200 border-gray-700'
                      : 'bg-gray-100 text-gray-800 border-gray-200',
                  ]"
                  class="px-3 py-1 rounded-full text-sm border transition-colors duration-200 hover:opacity-80"
                >
                  # {{ keyword.trim() }}
                </span>
              </div>

              <!-- Meta Data -->
              <div
                :class="[
                  colorMode.value === 'dark'
                    ? 'glass-card-dark'
                    : 'glass-card-light',
                ]"
                class="p-4 rounded-lg"
              >
                <h3
                  :class="[
                    colorMode.value === 'dark'
                      ? 'text-primary-400'
                      : 'text-blue-600',
                  ]"
                  class="font-semibold mb-2 flex items-center"
                >
                  <Icon name="material-symbols:info-outline" class="mr-2" />
                  Product Information
                </h3>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div
                    class="flex items-center"
                    :class="[
                      colorMode.value === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500',
                    ]"
                  >
                    <Icon
                      name="material-symbols:history"
                      class="mr-2 text-sm"
                    />
                    Version
                  </div>
                  <div
                    :class="[
                      colorMode.value === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700',
                    ]"
                  >
                    {{ product.version }}
                  </div>

                  <div
                    class="flex items-center"
                    :class="[
                      colorMode.value === 'dark'
                        ? 'text-gray-400'
                        : 'text-gray-500',
                    ]"
                  >
                    <Icon name="uil:calendar-alt" class="mr-2 text-sm" />
                    Updated
                  </div>
                  <div
                    :class="[
                      colorMode.value === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700',
                    ]"
                  >
                    {{ new Date(product.updated_at).toLocaleDateString() }}
                  </div>

                  <template
                    v-for="(value, key) in product.meta_data"
                    :key="key"
                  >
                    <div
                      class="flex items-center capitalize"
                      :class="[
                        colorMode.value === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-500',
                      ]"
                    >
                      <Icon
                        name="material-symbols:label-outline"
                        class="mr-2 text-sm"
                      />
                      {{ key }}
                    </div>
                    <div
                      :class="[
                        colorMode.value === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-700',
                      ]"
                    >
                      {{ value }}
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <!-- Product Info -->
            <div class="relative z-10">
              <div>
                <h1 class="text-4xl md:text-5xl font-bold mb-4 animate-float">
                  <span
                    :class="[
                      colorMode.value === 'dark'
                        ? 'bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-primary-400'
                        : 'text-blue-700',
                    ]"
                  >
                    {{ product.name }}
                  </span>
                </h1>
                <div class="space-y-6">
                  <div
                    :class="[
                      colorMode.value === 'dark'
                        ? 'from-gray-800/70 to-gray-900/70 border-gray-700'
                        : 'from-white to-gray-50 border-gray-200',
                    ]"
                    class="bg-gradient-to-br p-4 rounded-lg border shadow-sm"
                  >
                    <p
                      :class="[
                        colorMode.value === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-700',
                      ]"
                      class="text-lg leading-relaxed"
                    >
                      {{ product.post?.description }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <span
                        :class="[
                          colorMode.value === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-500',
                        ]"
                        class="text-sm"
                        >Starting from</span
                      >
                      <div class="flex items-center gap-2">
                        <span
                          :class="[
                            colorMode.value === 'dark'
                              ? 'text-white'
                              : 'text-gray-900',
                          ]"
                          class="text-3xl font-bold"
                          >${{ price }}</span
                        >
                        <span
                          :class="[
                            colorMode.value === 'dark'
                              ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
                              : 'bg-blue-500/20 text-blue-600 border-blue-500/30',
                          ]"
                          class="px-3 py-1 rounded-full border text-sm"
                        >
                          {{
                            product.packages && product.packages.length > 0
                              ? product.packages.length + " plans"
                              : "Standard"
                          }}
                        </span>
                      </div>
                    </div>
                    <button
                      @click="showPackagesModal = true"
                      :class="[
                        colorMode.value === 'dark'
                          ? 'bg-primary-500 hover:bg-primary-400 shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg',
                      ]"
                      class="px-6 py-3 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200"
                    >
                      {{ $t("products.choosePlan") }}
                    </button>
                  </div>

                  <!-- Features -->
                  <div
                    :class="[
                      colorMode.value === 'dark'
                        ? 'glass-card-dark'
                        : 'glass-card-light',
                    ]"
                    class="p-5 rounded-xl"
                  >
                    <h3
                      :class="[
                        colorMode.value === 'dark'
                          ? 'text-white'
                          : 'text-gray-900',
                      ]"
                      class="text-xl font-semibold mb-4 flex items-center"
                    >
                      <Icon
                        name="material-symbols:featured-play-list-outline"
                        class="mr-2"
                      />
                      {{ $t("products.keyFeatures") }}
                    </h3>
                    <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      <li
                        v-for="feature in features"
                        :key="feature"
                        :class="[
                          colorMode.value === 'dark'
                            ? 'text-gray-300'
                            : 'text-gray-700',
                        ]"
                        class="flex items-center gap-2"
                      >
                        <Icon
                          name="material-symbols:check-circle-outline"
                          :class="[
                            colorMode.value === 'dark'
                              ? 'text-primary-400'
                              : 'text-blue-600',
                          ]"
                          class="flex-shrink-0"
                        />
                        <span>{{ feature }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Content Section -->
      <div class="container mx-auto px-4 py-16">
        <div class="relative">
          <div
            :class="[
              colorMode.value === 'dark'
                ? 'bg-gradient-radial from-primary-500/10 via-transparent to-transparent'
                : 'bg-gradient-radial from-blue-300/20 via-blue-100/10 to-transparent',
            ]"
            class="absolute inset-0"
          ></div>
          <div
            :class="[
              colorMode.value === 'dark'
                ? 'glass-card-dark'
                : 'glass-card-light',
            ]"
            class="relative p-8 rounded-xl shadow-xl"
          >
            <!-- Content Header -->
            <div
              class="mb-8 border-b pb-4"
              :class="
                colorMode.value === 'dark'
                  ? 'border-gray-700'
                  : 'border-gray-200'
              "
            >
              <h2
                :class="[
                  colorMode.value === 'dark' ? 'text-white' : 'text-gray-900',
                ]"
                class="text-2xl font-bold"
              >
                {{ product.post?.title || "Product Details" }}
              </h2>
            </div>

            <!-- Product Content from HTML -->
            <div
              :class="[
                colorMode.value === 'dark' ? 'text-white' : 'text-gray-900',
              ]"
            >
              <div
                v-html="product.post?.html"
                class="prose prose-lg max-w-none dark:prose-invert"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Packages Modal -->
      <ProductPackagesModal
        v-if="product.packages && product.packages.length > 0"
        :show="showPackagesModal"
        :product="product"
        :packages="product.packages"
        @close="showPackagesModal = false"
        @purchase="handlePurchase"
      />
    </div>

    <!-- Not Found State -->
    <div
      v-else-if="error"
      :class="[colorMode.value === 'dark' ? 'text-white' : 'text-gray-900']"
      class="container mx-auto px-4 py-12 text-center"
    >
      <Icon
        name="material-symbols:error"
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
      />
      <h2 class="text-2xl font-bold mb-2">
        {{ $t("products.notFound.title") }}
      </h2>
      <p
        :class="[
          colorMode.value === 'dark' ? 'text-gray-300' : 'text-gray-600',
        ]"
        class="mb-6"
      >
        {{ $t("products.notFound.description") }}
      </p>
      <NuxtLink
        to="/products"
        :class="[
          colorMode.value === 'dark'
            ? 'bg-primary-500 hover:bg-primary-400'
            : 'bg-blue-600 hover:bg-blue-700',
        ]"
        class="px-6 py-3 text-white rounded-lg inline-block"
      >
        {{ $t("products.notFound.browseProducts") }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const colorMode = useColorMode();
const showPackagesModal = ref(false);
const route = useRoute();
const { $api } = useNuxtApp();
const price = ref(99.99); // Giá mặc định

// Mẫu dữ liệu mặc định cho các features
const features = ref([
  "Advanced Security Features",
  "Professional Tools Suite",
  "Windows Hello Integration",
  "BitLocker Encryption",
  "Remote Desktop Access",
  "Virtual Machine Support",
]);

// Lấy dữ liệu sản phẩm theo slug
const fetchProduct = async () => {
  try {
    const slug = route.params.slug;
    const response = await $api.get(`/api/products/view/${slug}`);

    if (response.data) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Sử dụng Nuxt's useAsyncData để lấy dữ liệu
const { data: product, error } = await useAsyncData("product", async () => {
  const apiResponse = await fetchProduct();

  if (apiResponse) {
    // Sử dụng giá từ package nếu có, nếu không dùng giá ngẫu nhiên
    if (apiResponse.packages && apiResponse.packages.length > 0) {
      const firstPackage = apiResponse.packages.find(
        (pkg) => pkg.price_unit === "USD"
      );
      if (firstPackage) {
        price.value = firstPackage.price;
      } else {
        price.value = parseFloat((Math.random() * 200 + 49.99).toFixed(2));
      }
    } else {
      price.value = parseFloat((Math.random() * 200 + 49.99).toFixed(2));
    }

    // Cập nhật meta data nếu có thông tin về features
    if (apiResponse.meta_data && apiResponse.meta_data.features) {
      features.value = apiResponse.meta_data.features;
    }

    return apiResponse;
  }

  return null;
});

// Xử lý khi mua sản phẩm
const handlePurchase = async (pkg) => {
  try {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const { data: user } = useAuth();

    if (!user.value) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập với URL trả về
      navigateTo(`/auth/login?redirect=${route.fullPath}`);
      return;
    }

    // Tạo đơn hàng trong cơ sở dữ liệu
    const response = await $api.post("/api/orders", {
      product_id: product.value?.id,
      package_id: pkg.id,
      amount: pkg.price,
    });

    if (response.data && response.data.id) {
      // Chuyển hướng đến trang thanh toán
      navigateTo(`/payment/${response.data.id}`);
    }
  } catch (error) {
    console.error("Error creating order:", error);
    // Xử lý lỗi (hiển thị thông báo, v.v.)
  }
};
</script>

<style scoped>
.glass-card-dark {
  background: linear-gradient(
    to bottom right,
    rgba(31, 41, 55, 0.5),
    rgba(17, 24, 39, 0.5)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(75, 85, 99, 0.2);
  border-radius: 1rem;
}

.glass-card-light {
  background: linear-gradient(
    to bottom right,
    rgba(241, 245, 249, 0.7),
    rgba(229, 231, 235, 0.7)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(209, 213, 219, 0.5);
  border-radius: 1rem;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
