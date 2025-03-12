<script setup>
definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
});

// Dữ liệu giả cho sản phẩm
const products = ref([
  { 
    id: 1, 
    name: 'Product 1', 
    slug: 'product-1', 
    version: '6.2.1', 
    packages: 2, 
    licenses: 8, 
    status: 'Active', 
    created: '26/12/2024' 
  },
  { 
    id: 2, 
    name: 'Product 2', 
    slug: 'product-2', 
    version: '9.6.9', 
    packages: 4, 
    licenses: 75, 
    status: 'Active', 
    created: '11/12/2024' 
  },
  { 
    id: 3, 
    name: 'Product 3', 
    slug: 'product-3', 
    version: '0.8.1', 
    packages: 3, 
    licenses: 24, 
    status: 'Active', 
    created: '2/1/2025' 
  },
  { 
    id: 4, 
    name: 'Product 4', 
    slug: 'product-4', 
    version: '1.5.1', 
    packages: 1, 
    licenses: 10, 
    status: 'Active', 
    created: '16/1/2025' 
  },
  { 
    id: 5, 
    name: 'Product 5', 
    slug: 'product-5', 
    version: '5.9.0', 
    packages: 3, 
    licenses: 79, 
    status: 'Active', 
    created: '2/3/2025' 
  },
  { 
    id: 6, 
    name: 'Product 6', 
    slug: 'product-6', 
    version: '6.1.0', 
    packages: 3, 
    licenses: 62, 
    status: 'Active', 
    created: '1/2/2025' 
  }
]);

// Tìm kiếm sản phẩm
const searchQuery = ref('');
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product => 
    product.name.toLowerCase().includes(query) || 
    product.slug.toLowerCase().includes(query) ||
    product.version.toLowerCase().includes(query)
  );
});

// Xóa sản phẩm
const deleteProduct = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    products.value = products.value.filter(product => product.id !== id);
  }
};
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
            />
          </div>
        </div>
        <div class="flex gap-2">
          <button class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center">
            <Icon name="heroicons:funnel" class="h-5 w-5 mr-2" />
            Filter
          </button>
          <button class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg flex items-center">
            <Icon name="heroicons:arrow-up-down" class="h-5 w-5 mr-2" />
            Sort
          </button>
        </div>
      </div>
    </div>
    
    <!-- Products table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Version</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Packages</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Licenses</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                    <Icon name="heroicons:cube" class="h-5 w-5" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ product.slug }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.version }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.packages }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.licenses }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ product.created }}</td>
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
            <tr v-if="filteredProducts.length === 0">
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
              Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredProducts.length }}</span> of <span class="font-medium">{{ filteredProducts.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                <span class="sr-only">Previous</span>
                <Icon name="heroicons:chevron-left" class="h-5 w-5" />
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">1</a>
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                <span class="sr-only">Next</span>
                <Icon name="heroicons:chevron-right" class="h-5 w-5" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 