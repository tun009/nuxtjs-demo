<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
});

const { $auth } = useNuxtApp();
const currentUser = ref($auth.getCurrentUser());

// Dữ liệu giả cho thống kê
const stats = ref({
  totalProducts: 6,
  totalUsers: 125,
  totalOrders: 342,
  revenue: 52580.75
});

// Dữ liệu giả cho đơn hàng gần đây
const recentOrders = ref([
  { id: 'ORD-001', user: 'John Doe', product: 'Windows 11 Pro', amount: 199.99, date: '2023-03-10', status: 'Completed' },
  { id: 'ORD-002', user: 'Jane Smith', product: 'Adobe Creative Cloud', amount: 52.99, date: '2023-03-09', status: 'Processing' },
  { id: 'ORD-003', user: 'Robert Johnson', product: 'Microsoft Office 365', amount: 99.99, date: '2023-03-08', status: 'Completed' },
  { id: 'ORD-004', user: 'Emily Davis', product: 'Windows 11 Pro', amount: 199.99, date: '2023-03-07', status: 'Completed' },
  { id: 'ORD-005', user: 'Michael Wilson', product: 'Adobe Creative Cloud', amount: 599.99, date: '2023-03-06', status: 'Failed' }
]);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    
    <!-- Thống kê -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 shadow-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-blue-100">Total Products</p>
            <h3 class="text-3xl font-bold text-white">{{ stats.totalProducts }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-400/30 flex items-center justify-center">
            <Icon name="heroicons:cube" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 shadow-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-purple-100">Total Users</p>
            <h3 class="text-3xl font-bold text-white">{{ stats.totalUsers }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-400/30 flex items-center justify-center">
            <Icon name="heroicons:users" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 shadow-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-green-100">Total Orders</p>
            <h3 class="text-3xl font-bold text-white">{{ stats.totalOrders }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-400/30 flex items-center justify-center">
            <Icon name="heroicons:shopping-cart" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div class="bg-gradient-to-br from-red-500 to-red-700 rounded-lg p-6 shadow-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-red-100">Total Revenue</p>
            <h3 class="text-3xl font-bold text-white">${{ stats.revenue.toLocaleString() }}</h3>
          </div>
          <div class="w-12 h-12 rounded-full bg-red-400/30 flex items-center justify-center">
            <Icon name="heroicons:currency-dollar" class="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Đơn hàng gần đây -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        <NuxtLink to="/admin/orders" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          View All
        </NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th class="pb-3 font-medium">Order ID</th>
              <th class="pb-3 font-medium">Customer</th>
              <th class="pb-3 font-medium">Product</th>
              <th class="pb-3 font-medium">Amount</th>
              <th class="pb-3 font-medium">Date</th>
              <th class="pb-3 font-medium">Status</th>
              <th class="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" class="border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <td class="py-3 font-medium">{{ order.id }}</td>
              <td class="py-3">{{ order.user }}</td>
              <td class="py-3">{{ order.product }}</td>
              <td class="py-3">${{ order.amount }}</td>
              <td class="py-3">{{ order.date }}</td>
              <td class="py-3">
                <span :class="{
                  'px-2 py-1 rounded text-xs font-medium': true,
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': order.status === 'Completed',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400': order.status === 'Processing',
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': order.status === 'Failed'
                }">
                  {{ order.status }}
                </span>
              </td>
              <td class="py-3">
                <NuxtLink :to="`/admin/orders/${order.id}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Nút thao tác nhanh -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink to="/admin/products/new" class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center justify-center transition shadow-lg">
        <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
        Add New Product
      </NuxtLink>
      
      <NuxtLink to="/admin/users" class="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 flex items-center justify-center transition shadow-lg">
        <Icon name="heroicons:user-group" class="h-5 w-5 mr-2" />
        Manage Users
      </NuxtLink>
      
      <NuxtLink to="/admin/orders" class="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 flex items-center justify-center transition shadow-lg">
        <Icon name="heroicons:document-chart-bar" class="h-5 w-5 mr-2" />
        View Orders
      </NuxtLink>
    </div>
  </div>
</template> 