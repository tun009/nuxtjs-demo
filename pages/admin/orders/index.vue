<script setup>
definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
});

// Dữ liệu giả cho đơn hàng
const orders = ref([
  { 
    id: 'ORD-1001', 
    user: { id: 1, name: 'John Doe', email: 'john@example.com' }, 
    product: { id: 1, name: 'Product 1' }, 
    package: 'Professional', 
    amount: 99, 
    date: '2024-06-15', 
    status: 'Completed',
    paymentMethod: 'Credit Card'
  },
  { 
    id: 'ORD-1002', 
    user: { id: 2, name: 'Jane Smith', email: 'jane@example.com' }, 
    product: { id: 2, name: 'Product 2' }, 
    package: 'Basic', 
    amount: 49, 
    date: '2024-06-10', 
    status: 'Completed',
    paymentMethod: 'PayPal'
  },
  { 
    id: 'ORD-1003', 
    user: { id: 3, name: 'Robert Johnson', email: 'robert@example.com' }, 
    product: { id: 3, name: 'Product 3' }, 
    package: 'Enterprise', 
    amount: 199, 
    date: '2024-06-05', 
    status: 'Completed',
    paymentMethod: 'Bank Transfer'
  },
  { 
    id: 'ORD-1004', 
    user: { id: 4, name: 'Emily Davis', email: 'emily@example.com' }, 
    product: { id: 1, name: 'Product 1' }, 
    package: 'Professional', 
    amount: 99, 
    date: '2024-05-28', 
    status: 'Completed',
    paymentMethod: 'Credit Card'
  },
  { 
    id: 'ORD-1005', 
    user: { id: 5, name: 'Michael Brown', email: 'michael@example.com' }, 
    product: { id: 2, name: 'Product 2' }, 
    package: 'Basic', 
    amount: 49, 
    date: '2024-05-20', 
    status: 'Completed',
    paymentMethod: 'PayPal'
  },
  { 
    id: 'ORD-1006', 
    user: { id: 6, name: 'Sarah Wilson', email: 'sarah@example.com' }, 
    product: { id: 3, name: 'Product 3' }, 
    package: 'Enterprise', 
    amount: 199, 
    date: '2024-05-15', 
    status: 'Pending',
    paymentMethod: 'Bank Transfer'
  },
  { 
    id: 'ORD-1007', 
    user: { id: 7, name: 'David Miller', email: 'david@example.com' }, 
    product: { id: 1, name: 'Product 1' }, 
    package: 'Basic', 
    amount: 49, 
    date: '2024-05-10', 
    status: 'Failed',
    paymentMethod: 'Credit Card'
  },
  { 
    id: 'ORD-1008', 
    user: { id: 8, name: 'Jennifer Taylor', email: 'jennifer@example.com' }, 
    product: { id: 2, name: 'Product 2' }, 
    package: 'Professional', 
    amount: 99, 
    date: '2024-05-05', 
    status: 'Refunded',
    paymentMethod: 'PayPal'
  }
]);

// Tìm kiếm đơn hàng
const searchQuery = ref('');
const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value;
  const query = searchQuery.value.toLowerCase();
  return orders.value.filter(order => 
    order.id.toLowerCase().includes(query) || 
    order.user.name.toLowerCase().includes(query) || 
    order.user.email.toLowerCase().includes(query) ||
    order.product.name.toLowerCase().includes(query)
  );
});

// Lọc theo trạng thái
const statusFilter = ref('all');
const statusFilteredOrders = computed(() => {
  if (statusFilter.value === 'all') return filteredOrders.value;
  return filteredOrders.value.filter(order => order.status.toLowerCase() === statusFilter.value.toLowerCase());
});

// Sắp xếp
const sortBy = ref('date');
const sortDirection = ref('desc');

const sortedOrders = computed(() => {
  const orders = [...statusFilteredOrders.value];
  
  orders.sort((a, b) => {
    let comparison = 0;
    
    if (sortBy.value === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy.value === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy.value === 'id') {
      comparison = a.id.localeCompare(b.id);
    } else if (sortBy.value === 'customer') {
      comparison = a.user.name.localeCompare(b.user.name);
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
  
  return orders;
});

// Thay đổi sắp xếp
const changeSort = (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortDirection.value = 'desc';
  }
};

// Phân trang
const currentPage = ref(1);
const itemsPerPage = ref(5);

const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return sortedOrders.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(sortedOrders.value.length / itemsPerPage.value);
});

const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Chuyển trang
const goToPage = (page) => {
  currentPage.value = page;
};

// Xóa đơn hàng
const deleteOrder = (id) => {
  if (confirm('Are you sure you want to delete this order?')) {
    orders.value = orders.value.filter(order => order.id !== id);
  }
};

// Thống kê
const statistics = computed(() => {
  const total = orders.value.length;
  const completed = orders.value.filter(order => order.status === 'Completed').length;
  const pending = orders.value.filter(order => order.status === 'Pending').length;
  const failed = orders.value.filter(order => order.status === 'Failed').length;
  const refunded = orders.value.filter(order => order.status === 'Refunded').length;
  
  const totalRevenue = orders.value
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.amount, 0);
  
  return {
    total,
    completed,
    pending,
    failed,
    refunded,
    totalRevenue
  };
});

// Định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Định dạng ngày
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Orders</h1>
    </div>
    
    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-4">
            <Icon name="heroicons:shopping-cart" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
            <div class="text-2xl font-bold">{{ statistics.total }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 mr-4">
            <Icon name="heroicons:check-circle" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Completed</div>
            <div class="text-2xl font-bold">{{ statistics.completed }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-600 dark:text-yellow-300 mr-4">
            <Icon name="heroicons:clock" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Pending</div>
            <div class="text-2xl font-bold">{{ statistics.pending }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300 mr-4">
            <Icon name="heroicons:x-circle" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Failed/Refunded</div>
            <div class="text-2xl font-bold">{{ statistics.failed + statistics.refunded }}</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-4">
            <Icon name="heroicons:currency-dollar" class="h-6 w-6" />
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
            <div class="text-2xl font-bold">{{ formatCurrency(statistics.totalRevenue) }}</div>
          </div>
        </div>
      </div>
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
              placeholder="Search orders by ID, customer, or product..." 
            />
          </div>
        </div>
        <div class="flex gap-2">
          <select 
            v-model="statusFilter" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          
          <select 
            v-model="itemsPerPage" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option :value="5">5 per page</option>
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Orders table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                @click="changeSort('id')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Order ID
                  <Icon 
                    v-if="sortBy === 'id'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="changeSort('customer')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Customer
                  <Icon 
                    v-if="sortBy === 'customer'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
              <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Package</th>
              <th 
                @click="changeSort('amount')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Amount
                  <Icon 
                    v-if="sortBy === 'amount'" 
                    :name="sortDirection === 'asc' ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                    class="h-4 w-4 ml-1" 
                  />
                </div>
              </th>
              <th 
                @click="changeSort('date')" 
                class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div class="flex items-center">
                  Date
                  <Icon 
                    v-if="sortBy === 'date'" 
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
            <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ order.user.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ order.user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ order.product.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ order.package }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatCurrency(order.amount) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ formatDate(order.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    order.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <NuxtLink :to="`/admin/orders/${order.id}`" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Icon name="heroicons:eye" class="h-5 w-5" />
                  </NuxtLink>
                  <button @click="deleteOrder(order.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <Icon name="heroicons:trash" class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedOrders.length === 0">
              <td colspan="8" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No orders found. Try a different search term or filter.
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
              Showing <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, sortedOrders.length) }}</span> of <span class="font-medium">{{ sortedOrders.length }}</span> results
            </p>
          </div>
          <div v-if="totalPages > 1">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button 
                @click="goToPage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <Icon name="heroicons:chevron-left" class="h-5 w-5" />
              </button>
              
              <button 
                v-for="page in pageNumbers" 
                :key="page" 
                @click="goToPage(page)" 
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium',
                  currentPage === page 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
              >
                {{ page }}
              </button>
              
              <button 
                @click="goToPage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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