<script setup>
import { useUserStore } from '~/stores/user';

definePageMeta({
  middleware: ['user'],
  layout: 'default'
});

const userStore = useUserStore();
const currentUser = computed(() => userStore.user || {});

// Dữ liệu giả cho đơn hàng của user
const userOrders = ref([
  { id: 'ORD-001', product: 'Windows 11 Pro', amount: 199.99, date: '2023-03-10', status: 'Completed' },
  { id: 'ORD-002', product: 'Adobe Creative Cloud', amount: 52.99, date: '2023-03-09', status: 'Processing' },
  { id: 'ORD-003', product: 'Microsoft Office 365', amount: 99.99, date: '2023-03-08', status: 'Completed' },
]);

// Dữ liệu giả cho licenses của user
const userLicenses = ref([
  { id: 'LIC-001', product: 'Windows 11 Pro', key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', expires: '2024-03-10', status: 'Active' },
  { id: 'LIC-002', product: 'Adobe Creative Cloud', key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', expires: '2024-03-09', status: 'Active' },
  { id: 'LIC-003', product: 'Microsoft Office 365', key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', expires: '2024-03-08', status: 'Active' },
]);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {{ currentUser?.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Here's an overview of your account</p>
        </div>
        <div class="mt-4 md:mt-0">
          <NuxtLink to="/products" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Icon name="heroicons:shopping-cart" class="h-5 w-5 mr-2" />
            Browse Products
          </NuxtLink>
        </div>
      </div>
      
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 mr-4">
              <Icon name="heroicons:key" class="h-6 w-6" />
            </div>
            <div>
              <div class="text-sm text-blue-500 dark:text-blue-300">Active Licenses</div>
              <div class="text-2xl font-semibold text-blue-700 dark:text-blue-200">{{ userLicenses.length }}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 mr-4">
              <Icon name="heroicons:shopping-cart" class="h-6 w-6" />
            </div>
            <div>
              <div class="text-sm text-green-500 dark:text-green-300">Total Orders</div>
              <div class="text-2xl font-semibold text-green-700 dark:text-green-200">{{ userOrders.length }}</div>
            </div>
          </div>
        </div>
        
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 mr-4">
              <Icon name="heroicons:building-office" class="h-6 w-6" />
            </div>
            <div>
              <div class="text-sm text-purple-500 dark:text-purple-300">Branch</div>
              <div class="text-2xl font-semibold text-purple-700 dark:text-purple-200">{{ currentUser?.branch?.name || 'N/A' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Orders -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
        <NuxtLink to="/user/orders" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          View All
        </NuxtLink>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th class="pb-3 font-medium">Order ID</th>
              <th class="pb-3 font-medium">Product</th>
              <th class="pb-3 font-medium">Amount</th>
              <th class="pb-3 font-medium">Date</th>
              <th class="pb-3 font-medium">Status</th>
              <th class="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in userOrders" :key="order.id" class="border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <td class="py-3 font-medium">{{ order.id }}</td>
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
                <NuxtLink :to="`/user/orders/${order.id}`" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Your Licenses -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Your Licenses</h2>
        <NuxtLink to="/user/licenses" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
          View All
        </NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="license in userLicenses" :key="license.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-gray-900 dark:text-white">{{ license.product }}</h3>
            <span :class="{
              'px-2 py-1 rounded text-xs font-medium': true,
              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': license.status === 'Active',
              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': license.status === 'Expired'
            }">
              {{ license.status }}
            </span>
          </div>
          
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <div class="mb-1">
              <span class="font-medium">License Key:</span> {{ license.key }}
            </div>
            <div>
              <span class="font-medium">Expires:</span> {{ license.expires }}
            </div>
          </div>
          
          <div class="flex justify-end">
            <button class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 