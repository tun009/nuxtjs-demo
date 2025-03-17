<script setup>
definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
});

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
  last_page: 1
});

// Tham số tìm kiếm và lọc
const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(10); // Mặc định hiển thị 10 sản phẩm mỗi trang
const perPageOptions = [10, 25, 50, 100]; // Các tùy chọn số lượng hiển thị

// Tham số sắp xếp
const sortField = ref('id');
const sortDirection = ref('desc');

// Lấy danh sách sản phẩm từ API
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    console.log('Fetching products...');
    const response = await $api.get('api/products', {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: searchQuery.value || undefined,
        sort_by: sortField.value,
        sort_direction: sortDirection.value
      }
    });
    
    console.log('API response:', response);
    
    if (response.success) {
      products.value = response.data.data;
      
      // Cập nhật thông tin phân trang
      pagination.value = {
        current_page: response.data.current_page,
        per_page: response.data.per_page,
        total: response.data.total,
        last_page: Math.ceil(response.data.total / response.data.per_page),
        next_page_url: response.data.next_page_url,
        prev_page_url: response.data.prev_page_url
      };
    } else {
      error.value = response.message || 'Failed to fetch products';
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    error.value = err.message || 'An error occurred while fetching products';
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

// Xử lý thay đổi số lượng hiển thị
const changePerPage = (value) => {
  perPage.value = value;
  currentPage.value = 1; // Reset về trang đầu tiên khi thay đổi số lượng hiển thị
  fetchProducts();
};

// Xử lý sắp xếp
const toggleSort = (field) => {
  if (sortField.value === field) {
    // Nếu đang sắp xếp theo field này, đổi hướng sắp xếp
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Nếu sắp xếp theo field mới, mặc định sắp xếp tăng dần
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1; // Reset về trang đầu tiên khi thay đổi sắp xếp
  fetchProducts();
};

// Xử lý tìm kiếm
const handleSearch = () => {
  currentPage.value = 1; // Reset về trang đầu tiên khi tìm kiếm
  fetchProducts();
};

// Xóa sản phẩm
const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await $api.delete(`api/products/${id}`);
      if (response.success) {
        // Refresh danh sách sản phẩm sau khi xóa
        fetchProducts();
      } else {
        alert(response.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.message || 'An error occurred while deleting the product');
    }
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// Theo dõi thay đổi của route để cập nhật trang
watch(() => route.query.page, (newPage) => {
  if (newPage) {
    currentPage.value = parseInt(newPage);
  } else {
    currentPage.value = 1;
  }
  fetchProducts();
}, { immediate: true });

// Fetch products khi component được tạo
onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Products</h1>
      <NuxtLink to="/admin/products/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
        <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
        New Product
      </NuxtLink>
    </div>
    
    <!-- Search and filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="Search Products..." 
              @keyup.enter="handleSearch"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="handleSearch" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5 mr-2" />
            Search
          </button>
          <div class="relative">
            <select 
              v-model="perPage" 
              @change="changePerPage(perPage)"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }} per page</option>
            </select>
          </div>
          <button class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center">
            <Icon name="heroicons:funnel" class="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm flex justify-center">
      <div class="flex flex-col items-center">
        <Icon name="heroicons:arrow-path" class="h-8 w-8 text-blue-500 animate-spin" />
        <p class="mt-2 text-gray-600 dark:text-gray-400">Loading products...</p>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
      <div class="text-center text-red-500">
        <Icon name="heroicons:exclamation-circle" class="h-8 w-8 mx-auto" />
        <p class="mt-2">{{ error }}</p>
        <button @click="fetchProducts" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Try Again
        </button>
      </div>
    </div>
    
    <!-- Products table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                @click="toggleSort('name')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div class="flex items-center">
                  Product
                  <Icon 
                    v-if="sortField === 'name'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="toggleSort('version')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div class="flex items-center">
                  Version
                  <Icon 
                    v-if="sortField === 'version'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="toggleSort('total_packages')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div class="flex items-center">
                  Packages
                  <Icon 
                    v-if="sortField === 'total_packages'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="toggleSort('total_licenses')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div class="flex items-center">
                  Licenses
                  <Icon 
                    v-if="sortField === 'total_licenses'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div v-if="product.thumbnail" class="w-10 h-10 rounded-md overflow-hidden mr-3">
                    <img :src="product.thumbnail" alt="Product thumbnail" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                    <Icon name="heroicons:cube" class="h-5 w-5" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ product.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.version }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.total_packages || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.total_licenses || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <NuxtLink :to="`/admin/products/${product.id}`" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Icon name="heroicons:eye" class="h-5 w-5" />
                  </NuxtLink>
                  <NuxtLink :to="`/admin/products/${product.id}/edit`" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <Icon name="heroicons:pencil-square" class="h-5 w-5" />
                  </NuxtLink>
                  <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Icon name="heroicons:trash" class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="products.length === 0">
              <td colspan="7" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No products found. Try a different search term or <NuxtLink to="/admin/products/new" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">add a new product</NuxtLink>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span> to 
              <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span> of 
              <span class="font-medium">{{ pagination.total }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="changePage(pagination.current_page - 1)" 
                :disabled="pagination.current_page === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
                  pagination.current_page === 1 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
              >
                <span class="sr-only">Previous</span>
                <Icon name="heroicons:chevron-left" class="h-5 w-5" />
              </button>
              
              <!-- Hiển thị các trang -->
              <template v-for="page in pagination.last_page" :key="page">
                <!-- Hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại -->
                <button 
                  v-if="page === 1 || page === pagination.last_page || (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)"
                  @click="changePage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
                    page === pagination.current_page
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-500'
                      : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                  ]"
                >
                  {{ page }}
                </button>
                
                <!-- Hiển thị dấu ... nếu có khoảng cách -->
                <span 
                  v-else-if="(page === 2 && pagination.current_page > 3) || (page === pagination.last_page - 1 && pagination.current_page < pagination.last_page - 2)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white"
                >
                  ...
                </span>
              </template>
              
              <button 
                @click="changePage(pagination.current_page + 1)" 
                :disabled="pagination.current_page === pagination.last_page"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
                  pagination.current_page === pagination.last_page 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
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
</template> 