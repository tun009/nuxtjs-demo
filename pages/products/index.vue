<template>
  <div
    class="min-h-screen overflow-hidden"
    :class="[
      colorMode.value === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-black'
        : 'bg-white',
    ]"
  >
    <!-- Hero Section -->
    <div
      class="relative h-[40vh] flex items-center justify-center overflow-hidden"
    >
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
            ? 'bg-gradient-radial from-primary-500/20 via-transparent to-transparent'
            : 'bg-gradient-radial from-blue-300/30 via-blue-100/20 to-transparent',
        ]"
        class="absolute inset-0"
      ></div>
      <div class="relative text-center z-10 max-w-5xl mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          <span
            :class="[
              colorMode.value === 'dark'
                ? 'bg-clip-text text-transparent bg-gradient-to-r from-neon-blue via-primary-400 to-neon-purple'
                : 'text-blue-700',
            ]"
          >
            {{ $t("products.title") }}
          </span>
        </h1>
        <p
          :class="[
            colorMode.value === 'dark' ? 'text-gray-300' : 'text-gray-700',
          ]"
          class="text-lg md:text-xl max-w-2xl mx-auto"
        >
          {{ $t("products.subtitle") }}
        </p>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="container mx-auto px-4 py-16">
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          :class="[
            colorMode.value === 'dark' ? 'border-blue-500' : 'border-blue-600',
          ]"
        ></div>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="text-center py-10">
        <div
          :class="[
            colorMode.value === 'dark'
              ? 'bg-red-900/20 border-red-800 text-red-200'
              : 'bg-red-50 border-red-200 text-red-600',
          ]"
          class="p-4 rounded-lg border"
        >
          <p>{{ error }}</p>
          <button
            @click="fetchProducts"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Products List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="product in products"
          :key="product.id"
          :class="[
            colorMode.value === 'dark'
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-primary-500/50'
              : 'bg-white border-gray-200 hover:border-blue-300',
          ]"
          class="group relative rounded-xl overflow-hidden border transition-all duration-300 shadow-md hover:shadow-xl"
        >
          <div
            :class="[
              colorMode.value === 'dark'
                ? 'bg-gradient-to-r from-primary-500/10 to-neon-purple/10'
                : 'bg-blue-50/50',
            ]"
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <!-- Product Image -->
          <div class="relative h-48 overflow-hidden">
            <img
              :src="product.thumbnail"
              :alt="product.name"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div
              :class="[
                colorMode.value === 'dark'
                  ? 'bg-gradient-to-t from-gray-900 to-transparent opacity-60'
                  : 'bg-gradient-to-t from-gray-800/40 to-transparent opacity-40',
              ]"
              class="absolute inset-0"
            ></div>
          </div>

          <!-- Product Info -->
          <div class="p-6 relative">
            <h3
              :class="[
                colorMode.value === 'dark'
                  ? 'text-white group-hover:text-primary-400'
                  : 'text-gray-900 group-hover:text-blue-600',
              ]"
              class="text-xl font-semibold mb-2 transition-colors"
            >
              {{ product.name }}
            </h3>
            <p
              :class="[
                colorMode.value === 'dark' ? 'text-gray-400' : 'text-gray-700',
              ]"
              class="mb-4 line-clamp-2"
            >
              {{ product.post?.description }}
            </p>

            <!-- Price and Action -->
            <div class="flex items-center justify-between">
              <span
                :class="[
                  colorMode.value === 'dark' ? 'text-white' : 'text-gray-900',
                ]"
                class="text-2xl font-bold"
              >
                ${{ product.price }}
              </span>
              <NuxtLink
                :to="'/products/' + product.slug"
                :class="[
                  colorMode.value === 'dark'
                    ? 'bg-primary-500 hover:bg-primary-400 shadow-[0_0_15px_rgba(0,115,245,0.5)] hover:shadow-[0_0_25px_rgba(0,115,245,0.8)]'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg',
                ]"
                class="px-4 py-2 text-white rounded-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                {{ $t("common.learnMore") }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const { $api } = useNuxtApp();

// Định nghĩa interface cho sản phẩm để có type checking
interface Product {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  version: string;
  thumbnail: string;
  status: string;
  post: {
    title: string;
    description: string;
  };
  price?: number; // Thêm trường giá (giả lập)
}

// State cho danh sách sản phẩm và loading
const products = ref<Product[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Lấy dữ liệu sản phẩm từ API
const fetchProducts = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    // Gọi API lấy danh sách sản phẩm
    const response = await $api.get("api/products");
    debugger;
    // Thêm giá giả lập cho mỗi sản phẩm
    if (response.data.data && Array.isArray(response.data.data)) {
      // Gán giá ngẫu nhiên từ $49.99 đến $249.99
      products.value = response.data.data.map((product: Product) => ({
        ...product,
        price: parseFloat((Math.random() * 200 + 49.99).toFixed(2)),
      }));
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Failed to load products. Please try again later.";
    // Sử dụng dữ liệu mẫu nếu API gặp lỗi
    products.value = getDefaultProducts();
  } finally {
    isLoading.value = false;
  }
};

// Dữ liệu mẫu để hiển thị khi API gặp vấn đề
const getDefaultProducts = (): Product[] => {
  return [
    {
      id: 1,
      uuid: "f8f114a1-697f-4e8f-b74a-273f03365fef",
      name: "Pro Video Editor",
      slug: "pro-video-editor",
      version: "3.0",
      thumbnail:
        "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      status: "active",
      post: {
        title: "Professional Video Editing Software",
        description:
          "Professional video editing software with advanced features.",
      },
      price: 99.99,
    },
    {
      id: 2,
      uuid: "f8f114a1-697f-4e8f-b74a-273f03365fe2",
      name: "Data Recovery Pro",
      slug: "data-recovery-pro",
      version: "2.5",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      status: "active",
      post: {
        title: "Recover Lost Files",
        description: "Recover lost files with our powerful recovery tool.",
      },
      price: 79.99,
    },
    {
      id: 3,
      uuid: "f8f114a1-697f-4e8f-b74a-273f03365fe3",
      name: "Security Suite",
      slug: "security-suite",
      version: "4.2",
      thumbnail:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      status: "active",
      post: {
        title: "Complete Protection for Your Digital Life",
        description: "Complete protection for your digital life.",
      },
      price: 129.99,
    },
  ];
};

// Gọi API khi component được mounted
onMounted(() => {
  fetchProducts();
});
</script>
