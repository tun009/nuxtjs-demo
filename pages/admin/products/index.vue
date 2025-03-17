<script setup>
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

// Import components
import Pagination from "~/components/common/Pagination.vue";
import DataTable from "~/components/common/DataTable.vue";
import ListPage from "~/components/common/ListPage.vue";
import Modal from "~/components/common/Modal.vue";
import PackageForm from "~/components/admin/products/PackageForm.vue";
import LicenseForm from "~/components/admin/products/LicenseForm.vue";

// Sử dụng API để lấy danh sách sản phẩm
const { $api } = useNuxtApp();
const router = useRouter();
const route = useRoute();

// Trạng thái
const loading = ref(true);
const error = ref(null);
const products = ref([]);
const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
});

// Modals
const showPackageModal = ref(false);
const showLicenseModal = ref(false);
const selectedProduct = ref(null);

// Tham số tìm kiếm và lọc
const searchQuery = ref("");
const currentPage = ref(1);
const perPage = ref(10); // Mặc định hiển thị 10 bản ghi
const sortBy = ref("id");
const sortDirection = ref("desc");

// Danh sách số lượng bản ghi hiển thị
const perPageOptions = [
  { value: 10, label: "10 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" },
];

// Cấu hình cột cho DataTable
const columns = [
  {
    key: "name",
    label: "Product",
    sortable: true,
  },
  {
    key: "version",
    label: "Version",
    sortable: true,
    width: "150px",
    align: "center",
  },
  {
    key: "total_packages",
    label: "Packages",
    sortable: false,
    width: "150px",
    align: "center",
  },
  {
    key: "total_licenses",
    label: "Licenses",
    sortable: false,
    width: "150px",
    align: "center",
  },
  {
    key: "status",
    label: "Status",
    sortable: false,
    width: "150px",
    align: "center",
  },
];

// Cấu hình actions cho DataTable
const actions = [
  {
    key: "view",
    icon: "heroicons:eye",
    label: "View Product",
    color:
      "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300",
  },
  {
    key: "edit",
    icon: "heroicons:pencil-square",
    label: "Edit Product",
    color:
      "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300",
  },
  {
    key: "add_package",
    icon: "heroicons:cube",
    label: "Add Package",
    color:
      "text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300",
  },
  {
    key: "add_license",
    icon: "heroicons:key",
    label: "Add License",
    color:
      "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300",
  },
  {
    key: "delete",
    icon: "heroicons:trash",
    label: "Delete Product",
    color:
      "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300",
  },
];

// Lấy danh sách sản phẩm từ API
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log("Fetching products...");
    const response = await $api.get("api/products", {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value || undefined,
        sort_by: sortBy.value,
        sort_direction: sortDirection.value,
      },
    });

    console.log("API response:", response);

    if (response.success) {
      products.value = response.data.data;

      // Cập nhật thông tin phân trang
      pagination.value = {
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total,
        last_page: Math.ceil(response.data.total / response.data.per_page),
        next_page_url: response.data.next_page_url,
        prev_page_url: response.data.prev_page_url,
      };
    } else {
      error.value = response.message || "Failed to fetch products";
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = err.message || "An error occurred while fetching products";
  } finally {
    loading.value = false;
  }
};

// Xử lý thay đổi trang
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return;
  currentPage.value = page;
  fetchProducts();
};

// Xử lý thay đổi số lượng bản ghi hiển thị
const changePerPage = (value) => {
  perPage.value = value;
  currentPage.value = 1; // Reset về trang đầu tiên
  fetchProducts();
};

// Xử lý sắp xếp
const handleSort = (column) => {
  if (sortBy.value === column) {
    // Nếu đang sắp xếp theo cột này, đảo ngược hướng sắp xếp
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // Nếu chuyển sang cột khác, mặc định sắp xếp theo chiều tăng dần
    sortBy.value = column;
    sortDirection.value = "asc";
  }
  currentPage.value = 1; // Reset về trang đầu tiên
  fetchProducts();
};

// Xử lý tìm kiếm
const handleSearch = () => {
  currentPage.value = 1; // Reset về trang đầu tiên khi tìm kiếm
  fetchProducts();
};

// Xử lý hành động trên DataTable
const handleAction = ({ action, item }) => {
  switch (action) {
    case "view":
      router.push(`/admin/products/${item.id}`);
      break;
    case "edit":
      router.push(`/admin/products/${item.id}/edit`);
      break;
    case "add_license":
      selectedProduct.value = item;
      showLicenseModal.value = true;
      break;
    case "add_package":
      selectedProduct.value = item;
      showPackageModal.value = true;
      break;
    case "delete":
      deleteProduct(item.id);
      break;
  }
};

// Xử lý thêm package thành công
const handlePackageSuccess = (data) => {
  showPackageModal.value = false;

  // Thông báo thành công (có thể sử dụng toast hoặc alert)
  alert(`Package "${data.name}" added successfully`);

  // Refresh danh sách sản phẩm
  fetchProducts();
};

// Xử lý thêm license thành công
const handleLicenseSuccess = (data) => {
  showLicenseModal.value = false;

  // Thông báo thành công (có thể sử dụng toast hoặc alert)
  alert(`License for "${data.email}" added successfully`);

  // Refresh danh sách sản phẩm
  fetchProducts();
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await $api.delete(`api/products/${id}`);
      if (response.success) {
        // Refresh danh sách sản phẩm sau khi xóa
        fetchProducts();
      } else {
        alert(response.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.message || "An error occurred while deleting the product");
    }
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

// Theo dõi thay đổi của route để cập nhật trang
watch(
  () => route.query.page,
  (newPage) => {
    if (newPage) {
      currentPage.value = parseInt(newPage);
    } else {
      currentPage.value = 1;
    }
    fetchProducts();
  },
  { immediate: true }
);

// Fetch products khi component được tạo
onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <ListPage
    title="Products"
    action-text="New Product"
    action-icon="heroicons:plus"
    action-route="/admin/products/new"
    :error="error"
    :loading="loading"
    v-model:search-value="searchQuery"
    search-placeholder="Search Products..."
    @search="handleSearch"
    @retry="fetchProducts"
  >
    <!-- DataTable Component -->
    <DataTable
      :columns="columns"
      :items="products"
      :loading="loading"
      :sort-by="sortBy"
      :sort-direction="sortDirection"
      :actions="actions"
      :actions-dropdown="true"
      :empty-message="'No products found. Try a different search term or add a new product.'"
      @sort="handleSort"
      @action="handleAction"
      class="flex-1"
    >
      <!-- Custom cell templates -->
      <template #cell(name)="{ item }">
        <div class="flex items-center">
          <div
            v-if="item.thumbnail"
            class="w-10 h-10 rounded-md overflow-hidden mr-3"
          >
            <img
              :src="item.thumbnail"
              alt="Product thumbnail"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3"
          >
            <Icon name="heroicons:cube" class="h-5 w-5" />
          </div>
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ item.name }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ item.slug }}
            </div>
          </div>
        </div>
      </template>

      <template #cell(status)="{ item }">
        <span
          class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          Active
        </span>
      </template>
    </DataTable>

    <!-- Pagination Component -->
    <template #pagination>
      <Pagination
        v-if="!loading && !error"
        :current-page="currentPage"
        :per-page="perPage"
        :total="pagination.total"
        @page-change="changePage"
        @per-page-change="changePerPage"
        class="mt-auto"
      />
    </template>
  </ListPage>

  <!-- Package Modal -->
  <Modal v-model="showPackageModal" title="Add Package" size="md">
    <PackageForm
      v-if="selectedProduct"
      :product-id="selectedProduct.id"
      :product-name="selectedProduct.name"
      @success="handlePackageSuccess"
      @cancel="showPackageModal = false"
    />
  </Modal>

  <!-- License Modal -->
  <Modal v-model="showLicenseModal" title="Add License" size="md">
    <LicenseForm
      v-if="selectedProduct"
      :product-id="selectedProduct.id"
      :product-name="selectedProduct.name"
      @success="handleLicenseSuccess"
      @cancel="showLicenseModal = false"
    />
  </Modal>
</template>
