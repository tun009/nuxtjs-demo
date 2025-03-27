<script setup>
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

// Import components
import Modal from "~/components/common/Modal.vue";
import PackageForm from "~/components/admin/products/PackageForm.vue";

// Import notification utilities
import { confirm, notifySuccess, notifyError } from "~/utils/notification";

// Sử dụng API để lấy danh sách packages
const { $api } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Trạng thái
const loading = ref(true);
const error = ref(null);
const packages = ref([]);
const product = ref(null);
const productId = computed(() => route.params.id);

// Modal
const showPackageModal = ref(false);

// Fetch thông tin sản phẩm và danh sách packages
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch thông tin sản phẩm
    const productResponse = await $api.get(
      `api/products/${productId.value}/packages`
    );

    if (productResponse.success) {
      product.value = productResponse.data;

      // Fetch danh sách packages của sản phẩm
      const packagesResponse = await $api.get(
        `api/products/${productId.value}/packages`
      );

      if (packagesResponse.success) {
        packages.value = packagesResponse?.data?.data;
      } else {
        error.value = packagesResponse.message || "Failed to fetch packages";
      }
    } else {
      error.value = productResponse.message || "Failed to fetch product";
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = err.message || "An error occurred while fetching data";
  } finally {
    loading.value = false;
  }
};

// Xử lý thêm package thành công
const handlePackageSuccess = (data) => {
  showPackageModal.value = false;
  notifySuccess(`Package "${data.name}" added successfully`);
  // Refresh danh sách packages
  fetchData();
};

// Format giá
const formatPrice = (price, currency) => {
  if (!price) return "";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  });

  return formatter.format(price);
};

// Xóa package
const deletePackage = async (id) => {
  confirm(
    "Are you sure you want to delete this package?",
    "Confirm Delete",
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const response = await $api.delete(`api/product-packages/${id}`);
      if (response.success) {
        notifySuccess("Package deleted successfully");
        // Refresh danh sách packages
        fetchData();
      } else {
        notifyError(response.message || "Failed to delete package");
      }
    } catch (err) {
      console.error("Error deleting package:", err);
      notifyError(err.message || "An error occurred while deleting the package");
    }
  }).catch(() => {
    // User cancelled
  });
};

// Chạy fetch data khi component được mount
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ product ? `Packages for ${product.name}` : "Packages" }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your product packages
        </p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="router.push(`/admin/products/${productId}`)"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <div class="flex items-center">
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Back to Product
          </div>
        </button>
        <button
          @click="showPackageModal = true"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          <div class="flex items-center">
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Add Package
          </div>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center">
        <Icon
          name="heroicons:arrow-path"
          class="h-8 w-8 text-blue-500 animate-spin"
        />
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading packages...</p>
      </div>
    </div>

    <!-- Error state -->

    <div
      v-else-if="error"
      class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm"
    >
      <div class="text-center text-red-500">
        <Icon name="heroicons:exclamation-circle" class="h-8 w-8 mx-auto" />
        <p class="mt-2">{{ error }}</p>
        <button
          @click="fetchData"
          class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="packages.length === 0"
      class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm"
    >
      <div class="text-center">
        <Icon name="heroicons:cube" class="h-12 w-12 mx-auto text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          No packages found
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new package for this product.
        </p>
        <div class="mt-6">
          <button
            @click="showPackageModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Icon name="heroicons:plus" class="-ml-1 mr-2 h-5 w-5" />
            Add Package
          </button>
        </div>
      </div>
    </div>

    <!-- Packages grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <div
        v-for="pkg in packages"
        :key="pkg?.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <!-- Package card -->
        <div class="px-6 py-5">
          <!-- Status indicator -->
          <div class="flex justify-between items-start mb-3">
            <span
              :class="[
                'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                pkg?.is_active
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
              ]"
            >
              {{ pkg?.is_active ? "Active" : "Inactive" }}
            </span>
            <div class="relative">
              <button class="text-gray-400 hover:text-gray-500">
                <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
              </button>
              <!-- Dropdown menu can be added here -->
            </div>
          </div>

          <!-- Package info -->
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ pkg?.name }}
          </h3>

          <div class="mb-3">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatPrice(pkg?.price, pkg?.price_unit) }}
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div
              class="flex items-center text-sm text-gray-600 dark:text-gray-400"
            >
              <Icon name="heroicons:device-tablet" class="h-4 w-4 mr-2" />
              {{ pkg.limit_devices }} device{{
                pkg.limit_devices !== 1 ? "s" : ""
              }}
            </div>
            <div
              class="flex items-center text-sm text-gray-600 dark:text-gray-400"
            >
              <Icon name="heroicons:clock" class="h-4 w-4 mr-2" />
              {{ pkg.time_of_use }} month{{ pkg.time_of_use !== 1 ? "s" : "" }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-2 mt-4">
            <button
              class="flex-1 px-3 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/30"
              @click="
                router.push(
                  `/admin/products/${productId}/packages/${pkg.id}/edit`
                )
              "
            >
              Edit
            </button>
            <button
              class="flex-1 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/30"
              @click="deletePackage(pkg.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Package Modal -->
  <Modal v-model="showPackageModal" title="Add Package" size="md">
    <PackageForm
      v-if="productId"
      :product-id="productId"
      :product-name="product?.name"
      @success="handlePackageSuccess"
      @cancel="showPackageModal = false"
    />
  </Modal>
</template>

<style scoped>
/* Thiết lập aspect ratio cho các card để chúng có kích thước đồng nhất */
.aspect-ratio-box {
  position: relative;
  padding-top: 100%; /* 1:1 Aspect Ratio */
}

.aspect-ratio-box-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
