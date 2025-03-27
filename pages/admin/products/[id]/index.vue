<script setup>
import { confirm, notifySuccess, notifyError } from "~/utils/notification";

definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const route = useRoute();
const productId = route.params.id;
const { $api } = useNuxtApp();
const loading = ref(true);
const error = ref(null);

// Product data
const product = ref({
  id: productId,
  name: "",
  slug: "",
  description: "",
  version: "",
  price: 0,
  image: null,
  thumbnail: null,
  status: "",
  features: [],
  created_at: "",
  updated_at: "",
  post: {
    title: "",
    description: "",
    html: "",
    keywords: "",
    show_full_page: false,
  },
  meta_data: {},
  uuid: "",
  update_url: "",
  download_url: "",
  encrypt_public_key: "",
  encrypt_private_key: "",
  stats: {
    totalSales: 0,
    totalRevenue: 0,
    activeUsers: 0,
    rating: 0,
  },
});

// Quản lý licenses
const licenses = ref([]);
const loadingLicenses = ref(false);
const licensesError = ref(null);
const showLicenseForm = ref(false);
const editingLicense = ref(null);

// Phân trang cho licenses
const licensePagination = ref({
  current_page: 1,
  total: 0,
  per_page: 10,
});

// Fetch danh sách licenses
const fetchLicenses = async (page = 1) => {
  loadingLicenses.value = true;
  licensesError.value = null;

  try {
    const response = await $api.get("/api/licenses", {
      params: {
        product_id: productId,
        per_page: licensePagination.value.per_page,
        page: page,
      },
    });

    if (response.success) {
      licenses.value = response.data.data || [];

      // Cập nhật thông tin phân trang
      if (response.data.current_page !== undefined) {
        licensePagination.value = {
          current_page: response.data.current_page,
          total: response.data.total || 0,
          per_page: response.data.per_page || 10,
        };
      }
    } else {
      licensesError.value =
        response.message || "Không thể tải danh sách license";
    }
  } catch (err) {
    console.error("Error fetching licenses:", err);
    licensesError.value =
      err.message || "Đã xảy ra lỗi khi tải danh sách license";
  } finally {
    loadingLicenses.value = false;
  }
};

// Xóa license
const deleteLicense = (licenseId) => {
  confirm(
    "Bạn có chắc chắn muốn xóa license này không?",
    "Xác nhận xóa",
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const response = await $api.delete(`api/licenses/${licenseId}`);
      if (response.success) {
        notifySuccess("License đã được xóa thành công");
        // Refresh license list
        fetchLicenses();
      } else {
        notifyError(response.message || "Không thể xóa license");
      }
    } catch (err) {
      console.error("Error deleting license:", err);
      notifyError(err.message || "Đã xảy ra lỗi khi xóa license");
    }
  }).catch(() => {
    // Cancelled by user
  });
};

// Thêm license mới
const addLicense = () => {
  showLicenseForm.value = true;
  editingLicense.value = null;
};

// Chỉnh sửa license
const editLicense = (license) => {
  editingLicense.value = { ...license };
  showLicenseForm.value = true;
};

// Đóng form license
const closeLicenseForm = () => {
  showLicenseForm.value = false;
  editingLicense.value = null;
};

// Xử lý khi thêm/sửa license thành công
const handleLicenseSuccess = async () => {
  showLicenseForm.value = false;
  editingLicense.value = null;
  await fetchLicenses(licensePagination.value.current_page);
};

// Fetch product data from API
const fetchProduct = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $api.get(`/api/products/${productId}`);

    if (response.success) {
      const productData = response.data;

      // Map API response to our product object
      product.value = {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        description: productData.description || "",
        version: productData.version || "",
        price: productData.price || 0,
        image: productData.image,
        status: productData.status || "inactive",
        features: productData.features || [],
        created_at: productData.created_at || "",
        updated_at: productData.updated_at || "",
        uuid: productData.uuid || "",
        update_url: productData.update_url || "",
        download_url: productData.download_url || "",
        encrypt_public_key: productData.encrypt_public_key || "",
        encrypt_private_key: productData.encrypt_private_key || "",
        meta_data: productData.meta_data || {},
        post: {
          title: productData.post?.title || "",
          description: productData.post?.description || "",
          html: productData.post?.html || "",
          keywords: productData.post?.keywords || "",
          show_full_page: productData.post?.show_full_page || false,
        },
        stats: {
          totalSales: 125, // Demo data since not in API
          totalRevenue: 12350,
          activeUsers: 98,
          rating: 4.7,
        },
      };
    } else {
      error.value = response.message || "Failed to fetch product";
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    error.value = err.message || "An error occurred while fetching the product";
  } finally {
    loading.value = false;
  }
};

// Dữ liệu giả cho các gói license
const packages = ref([
  {
    id: 1,
    name: "Basic",
    price: 49,
    period: "year",
    description: "For individual users",
    features: ["1 device", "Basic support", "1 year updates"],
    popular: false,
  },
  {
    id: 2,
    name: "Professional",
    price: 99,
    period: "year",
    description: "For professional users",
    features: ["3 devices", "Priority support", "2 years updates"],
    popular: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: 199,
    period: "year",
    description: "For enterprise users",
    features: ["Unlimited devices", "24/7 support", "Lifetime updates"],
    popular: false,
  },
]);

// Dữ liệu giả cho lịch sử đơn hàng
const orders = ref([
  {
    id: "ORD-1001",
    user: "John Doe",
    package: "Professional",
    amount: 99,
    date: "2024-06-15",
    status: "Completed",
  },
  {
    id: "ORD-1002",
    user: "Jane Smith",
    package: "Basic",
    amount: 49,
    date: "2024-06-10",
    status: "Completed",
  },
  {
    id: "ORD-1003",
    user: "Robert Johnson",
    package: "Enterprise",
    amount: 199,
    date: "2024-06-05",
    status: "Completed",
  },
  {
    id: "ORD-1004",
    user: "Emily Davis",
    package: "Professional",
    amount: 99,
    date: "2024-05-28",
    status: "Completed",
  },
  {
    id: "ORD-1005",
    user: "Michael Brown",
    package: "Basic",
    amount: 49,
    date: "2024-05-20",
    status: "Completed",
  },
]);

// Xóa sản phẩm
const router = useRouter();
const deleteProduct = () => {
  if (
    confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    )
  ) {
    // Giả lập API call
    setTimeout(() => {
      router.push("/admin/products");
    }, 500);
  }
};

// Delete package with confirmation
const confirmDeletePackage = (package_id) => {
  confirm(
    "Are you sure you want to delete this package? All associated orders will be affected.",
    "Confirm Delete",
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const response = await $api.delete(`api/product-packages/${package_id}`);
      if (response.success) {
        notifySuccess("Package deleted successfully");
        fetchPackages();
      } else {
        notifyError(response.message || "Failed to delete package");
      }
    } catch (err) {
      console.error("Error deleting package:", err);
      notifyError(err.message || "An error occurred while deleting the package");
    }
  }).catch(() => {
    // Cancelled by user
  });
};

// Fetch data when component is mounted
onMounted(() => {
  fetchProduct();
  fetchLicenses();
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <NuxtLink
          to="/admin/products"
          class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        </NuxtLink>
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <span
          class="ml-3 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          {{ product.status }}
        </span>
      </div>
      <div class="flex space-x-2">
        <NuxtLink
          :to="`/admin/products/${productId}/edit`"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Icon name="heroicons:pencil-square" class="h-5 w-5 mr-2" />
          Edit
        </NuxtLink>
        <button
          @click="deleteProduct"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Icon name="heroicons:trash" class="h-5 w-5 mr-2" />
          Delete
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 flex items-center justify-center"
        >
          <Icon
            name="heroicons:arrow-path"
            class="w-6 h-6 text-blue-500 animate-spin mr-2"
          />
          <span>Loading product information...</span>
        </div>

        <!-- Error State -->
        <div
          v-else-if="error"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-red-500"
        >
          <div class="flex items-center mb-2">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 mr-2" />
            <span class="font-medium">Error loading product information</span>
          </div>
          <p>{{ error }}</p>
          <button
            @click="fetchProduct"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>

        <!-- Product Information -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Product Information</h2>

          <div class="space-y-6">
            <!-- Basic Info -->
            <div>
              <h3
                class="text-md font-medium border-b border-gray-200 dark:border-gray-700 pb-2 mb-3"
              >
                Basic Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Product Name
                  </div>
                  <div>{{ product.name }}</div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Slug
                  </div>
                  <div>{{ product.slug }}</div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Version
                  </div>
                  <div>{{ product.version }}</div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Base Price
                  </div>
                  <div>${{ product.price.toFixed(2) }}</div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Created Date
                  </div>
                  <div>{{ product.created_at }}</div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Last Updated
                  </div>
                  <div>{{ product.updated_at }}</div>
                </div>
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </div>
                  <div>
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="{
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400':
                          product.status === 'active',
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400':
                          product.status === 'inactive',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400':
                          product.status === 'pending',
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400':
                          !['active', 'inactive', 'pending'].includes(
                            product.status
                          ),
                      }"
                    >
                      {{ product.status }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                >
                  Description
                </div>
                <div class="text-gray-700 dark:text-gray-300">
                  {{ product.description || "No description available" }}
                </div>
              </div>

              <div v-if="product.features && product.features.length > 0">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
                >
                  Features
                </div>
                <ul class="list-disc pl-5 space-y-1">
                  <li
                    v-for="(feature, index) in product.features"
                    :key="index"
                    class="text-gray-700 dark:text-gray-300"
                  >
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Post Info -->
            <div>
              <h3
                class="text-md font-medium border-b border-gray-200 dark:border-gray-700 pb-2 mb-3"
              >
                Post Information
              </h3>

              <div class="space-y-4">
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Post Title
                  </div>
                  <div class="text-gray-900 dark:text-white">
                    {{ product.post.title || "Not set" }}
                  </div>
                </div>

                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Post Description
                  </div>
                  <div
                    class="text-gray-900 dark:text-white whitespace-pre-line"
                  >
                    {{ product.post.description || "Not set" }}
                  </div>
                </div>

                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Keywords
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(keyword, index) in product.post.keywords
                        ? product.post.keywords.split(',')
                        : []"
                      :key="index"
                      class="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      {{ keyword.trim() }}
                    </span>
                    <span
                      v-if="!product.post.keywords"
                      class="text-gray-900 dark:text-white"
                    >
                      Not set
                    </span>
                  </div>
                </div>

                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Display Type
                  </div>
                  <div class="flex items-center mt-1">
                    <Icon
                      :name="
                        product.post.show_full_page
                          ? 'heroicons:check-circle'
                          : 'heroicons:x-circle'
                      "
                      class="w-5 h-5 mr-2"
                      :class="
                        product.post.show_full_page
                          ? 'text-green-500'
                          : 'text-gray-400'
                      "
                    />
                    <span class="text-gray-900 dark:text-white">
                      {{
                        product.post.show_full_page
                          ? "Show as full page"
                          : "Don't show as full page"
                      }}
                    </span>
                  </div>
                </div>

                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    HTML Content
                  </div>
                  <div class="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div
                      v-if="product.post.html"
                      class="prose dark:prose-invert max-w-none"
                      v-html="product.post.html"
                    ></div>
                    <div v-else class="text-gray-900 dark:text-white">
                      No HTML content available
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Technical Info -->
            <div>
              <h3
                class="text-md font-medium border-b border-gray-200 dark:border-gray-700 pb-2 mb-3"
              >
                Technical Information
              </h3>

              <div class="space-y-3">
                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Update URL
                  </div>
                  <div class="text-gray-900 dark:text-white break-all">
                    {{ product.update_url || "Not set" }}
                  </div>
                </div>

                <div>
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Download URL
                  </div>
                  <div class="text-gray-900 dark:text-white break-all">
                    {{ product.download_url || "Not set" }}
                  </div>
                </div>

                <div
                  v-if="
                    product.meta_data &&
                    Object.keys(product.meta_data).length > 0
                  "
                >
                  <div
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Meta Data
                  </div>
                  <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="prose dark:prose-invert max-w-none">
                      <pre class="text-xs">{{
                        JSON.stringify(product.meta_data, null, 2)
                      }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- License Packages -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Packages</h2>
            <NuxtLink
              :to="`/admin/products/${productId}/packages`"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <Icon name="heroicons:pencil-square" class="h-5 w-5 mr-1" />
              Manage
            </NuxtLink>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="pkg in packages"
              :key="pkg.id"
              :class="[
                'border rounded-lg p-4',
                pkg.popular
                  ? 'border-2 border-blue-500 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700',
              ]"
              class="relative"
            >
              <div
                v-if="pkg.popular"
                class="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg"
              >
                Popular
              </div>
              <div class="font-medium text-lg mb-1">{{ pkg.name }}</div>
              <div class="text-2xl font-bold mb-2">
                ${{ pkg.price
                }}<span class="text-sm font-normal text-gray-500">{{
                  "/" + pkg.period
                }}</span>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {{ pkg.description }}
              </div>
              <div class="space-y-2 mb-4">
                <div
                  v-for="(feature, idx) in pkg.features"
                  :key="idx"
                  class="flex items-center"
                >
                  <Icon
                    name="heroicons:check"
                    class="h-5 w-5 text-green-500 mr-2"
                  />
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Licenses -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">License Management</h2>
            <button
              @click="addLicense"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
              Add License
            </button>
          </div>

          <!-- License Form -->
          <div
            v-if="showLicenseForm"
            class="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">
                {{ editingLicense ? "Edit License" : "Add New License" }}
              </h3>
              <button
                @click="closeLicenseForm"
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Icon name="heroicons:x-mark" class="h-5 w-5" />
              </button>
            </div>

            <LicenseForm
              :product-id="productId"
              :product-name="product.name"
              :license="editingLicense"
              @success="handleLicenseSuccess"
              @cancel="closeLicenseForm"
            />
          </div>

          <!-- Loading State -->
          <div
            v-if="loadingLicenses"
            class="flex items-center justify-center py-12"
          >
            <Icon
              name="heroicons:arrow-path"
              class="w-6 h-6 text-blue-500 animate-spin mr-2"
            />
            <span>Loading license list...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="licensesError" class="py-8 text-center text-red-500">
            <div class="flex items-center justify-center mb-2">
              <Icon
                name="heroicons:exclamation-triangle"
                class="w-6 h-6 mr-2"
              />
              <span class="font-medium">{{ licensesError }}</span>
            </div>
            <button
              @click="fetchLicenses()"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="licenses.length === 0" class="py-12 text-center">
            <div
              class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4"
            >
              <Icon
                name="heroicons:key"
                class="h-8 w-8 text-gray-500 dark:text-gray-400"
              />
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No licenses available
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">
              Add the first license for this product now!
            </p>
            <button
              @click="addLicense"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
              Add License
            </button>
          </div>

          <!-- License List -->
          <div v-else>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      License Code
                    </th>
                    <th
                      class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Package
                    </th>
                    <th
                      class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Devices
                    </th>
                    <th
                      class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Expiration Date
                    </th>
                    <th
                      class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="license in licenses"
                    :key="license.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ license.license_code }}
                    </td>
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ license.owner_id || "N/A" }}
                    </td>
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ license.rel_package_id || "N/A" }}
                    </td>
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ license.limit_devices }}
                    </td>
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                    >
                      {{ license.expired_at || "N/A" }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span
                        class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="{
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400':
                            license.status === 'active',
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400':
                            license.status === 'inactive',
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400':
                            license.status === 'pending',
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400':
                            !['active', 'inactive', 'pending'].includes(
                              license.status
                            ),
                        }"
                      >
                        {{ license.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm">
                      <div class="flex items-center space-x-2">
                        <button
                          @click="editLicense(license)"
                          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit"
                        >
                          <Icon
                            name="heroicons:pencil-square"
                            class="h-5 w-5"
                          />
                        </button>
                        <button
                          @click="deleteLicense(license.id)"
                          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Icon name="heroicons:trash" class="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              v-if="licensePagination.total > licensePagination.per_page"
              class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 mt-4"
            >
              <div
                class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
              >
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    Showing
                    <span class="font-medium">{{
                      (licensePagination.current_page - 1) *
                        licensePagination.per_page +
                      1
                    }}</span>
                    to
                    <span class="font-medium">{{
                      Math.min(
                        licensePagination.current_page *
                          licensePagination.per_page,
                        licensePagination.total
                      )
                    }}</span>
                    of
                    <span class="font-medium">{{
                      licensePagination.total
                    }}</span>
                    results
                  </p>
                </div>
                <div>
                  <nav
                    class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      @click="fetchLicenses(licensePagination.current_page - 1)"
                      :disabled="licensePagination.current_page === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      :class="{
                        'opacity-50 cursor-not-allowed':
                          licensePagination.current_page === 1,
                      }"
                    >
                      <span class="sr-only">Previous</span>
                      <Icon name="heroicons:chevron-left" class="h-5 w-5" />
                    </button>
                    <button
                      @click="fetchLicenses(licensePagination.current_page + 1)"
                      :disabled="
                        licensePagination.current_page ===
                        Math.ceil(
                          licensePagination.total / licensePagination.per_page
                        )
                      "
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      :class="{
                        'opacity-50 cursor-not-allowed':
                          licensePagination.current_page ===
                          Math.ceil(
                            licensePagination.total / licensePagination.per_page
                          ),
                      }"
                    >
                      <span class="sr-only">Next</span>
                      <Icon name="heroicons:chevron-right" class="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Recent Orders</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Package
                  </th>
                  <th
                    class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="order in orders"
                  :key="order.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ order.id }}
                  </td>
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ order.user }}
                  </td>
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ order.package }}
                  </td>
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    ${{ order.amount }}
                  </td>
                  <td
                    class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ order.date }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 text-center">
            <NuxtLink
              to="/admin/orders"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              View All Orders
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Stats -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Statistics</h2>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Total Sales
                </div>
                <div class="text-sm font-medium">
                  {{ product.stats.totalSales }}
                </div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  style="width: 75%"
                ></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Total Revenue
                </div>
                <div class="text-sm font-medium">
                  ${{ product.stats.totalRevenue.toLocaleString() }}
                </div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-green-500 h-2 rounded-full"
                  style="width: 65%"
                ></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Active Users
                </div>
                <div class="text-sm font-medium">
                  {{ product.stats.activeUsers }}
                </div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-purple-500 h-2 rounded-full"
                  style="width: 80%"
                ></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <div
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Rating
                </div>
                <div class="text-sm font-medium">
                  {{ product.stats.rating }}/5
                </div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-yellow-500 h-2 rounded-full"
                  style="width: 90%"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Quick Actions</h2>

          <div class="space-y-3">
            <NuxtLink
              :to="`/admin/products/${productId}/edit`"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div
                class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3"
              >
                <Icon name="heroicons:pencil-square" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-medium">Edit Product</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Update product information
                </div>
              </div>
            </NuxtLink>

            <NuxtLink
              :to="`/admin/products/${productId}/packages`"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div
                class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3"
              >
                <Icon name="heroicons:tag" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-medium">Manage Packages</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Edit license packages
                </div>
              </div>
            </NuxtLink>

            <NuxtLink
              to="/admin/orders"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div
                class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 mr-3"
              >
                <Icon name="heroicons:shopping-cart" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-medium">View Orders</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  See all product orders
                </div>
              </div>
            </NuxtLink>

            <button
              @click="deleteProduct"
              class="w-full flex items-center p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              <div
                class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-300 mr-3"
              >
                <Icon name="heroicons:trash" class="h-5 w-5" />
              </div>
              <div class="text-left">
                <div class="text-sm font-medium">Delete Product</div>
                <div class="text-xs text-red-500 dark:text-red-400">
                  Remove this product
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Preview</h2>

          <div class="text-center">
            <div
              class="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4"
            >
              <Icon
                name="heroicons:cube"
                class="h-12 w-12 text-blue-600 dark:text-blue-300"
              />
            </div>

            <div class="text-lg font-medium mb-1">{{ product.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Version {{ product.version }}
            </div>

            <NuxtLink
              :to="`/products/${product.id}`"
              target="_blank"
              class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Icon name="heroicons:eye" class="h-5 w-5 mr-2" />
              View Public Page
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
