<script setup lang="ts">
definePageMeta({
  middleware: ['user']
});

import { useUserStore } from '~/stores/user';
const userStore = useUserStore();
const currentUser = computed(() => userStore.user || {});

// Dữ liệu giả cho đơn hàng
const orders = ref([
  { id: 'ORD-001', product: 'Windows 11 Pro', package: 'Single License', amount: 199.99, date: '2023-03-10', status: 'Completed' },
  { id: 'ORD-002', product: 'Adobe Creative Cloud', package: 'Annual Subscription', amount: 599.99, date: '2023-02-15', status: 'Active' }
]);

// Dữ liệu giả cho license
const licenses = ref([
  { 
    id: 'LIC-001', 
    product: 'Windows 11 Pro', 
    key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', 
    purchaseDate: '2023-03-10', 
    expiryDate: 'Lifetime', 
    status: 'Active' 
  },
  { 
    id: 'LIC-002', 
    product: 'Adobe Creative Cloud', 
    key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', 
    purchaseDate: '2023-02-15', 
    expiryDate: '2024-02-15', 
    status: 'Active' 
  }
]);

// Hiển thị/ẩn key
const showKey = ref<Record<string, boolean>>({});

// Hàm để chuyển đổi hiển thị key
const toggleShowKey = (id: string) => {
  showKey.value[id] = !showKey.value[id];
};

// Hàm để sao chép key
const copyKey = (key: string) => {
  navigator.clipboard.writeText(key);
  // Trong thực tế, bạn có thể hiển thị thông báo thành công
};

// Hàm đăng xuất
const logout = () => {
  userStore.logout();
};
</script>

<template>
  <div class="user-dashboard">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Account</h1>
      
      <!-- Thông tin người dùng -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center mb-4 md:mb-0">
            <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {{ currentUser?.name?.charAt(0) || 'U' }}
            </div>
            <div class="ml-4">
              <h2 class="text-xl font-semibold text-white">{{ currentUser?.name || 'User' }}</h2>
              <p class="text-gray-300">{{ currentUser?.email || 'user@example.com' }}</p>
            </div>
          </div>
          <div class="flex space-x-4">
            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Edit Profile
            </button>
            <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition" @click="logout">
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <!-- Licenses -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">My Licenses</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-400 border-b border-gray-700">
                <th class="pb-3 font-medium">License ID</th>
                <th class="pb-3 font-medium">Product</th>
                <th class="pb-3 font-medium">License Key</th>
                <th class="pb-3 font-medium">Purchase Date</th>
                <th class="pb-3 font-medium">Expiry</th>
                <th class="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="license in licenses" :key="license.id" class="border-b border-gray-700 text-gray-300">
                <td class="py-3 font-medium">{{ license.id }}</td>
                <td class="py-3">{{ license.product }}</td>
                <td class="py-3">
                  <div class="flex items-center">
                    <span v-if="showKey[license.id]">{{ license.key }}</span>
                    <span v-else>•••••-•••••-•••••-•••••-•••••</span>
                    <button 
                      class="ml-2 text-blue-400 hover:text-blue-300 transition"
                      @click="toggleShowKey(license.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="showKey[license.id]" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      class="ml-2 text-blue-400 hover:text-blue-300 transition"
                      @click="copyKey(license.key)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td class="py-3">{{ license.purchaseDate }}</td>
                <td class="py-3">{{ license.expiryDate }}</td>
                <td class="py-3">
                  <span class="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                    {{ license.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Orders -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">Order History</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-400 border-b border-gray-700">
                <th class="pb-3 font-medium">Order ID</th>
                <th class="pb-3 font-medium">Product</th>
                <th class="pb-3 font-medium">Package</th>
                <th class="pb-3 font-medium">Amount</th>
                <th class="pb-3 font-medium">Date</th>
                <th class="pb-3 font-medium">Status</th>
                <th class="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id" class="border-b border-gray-700 text-gray-300">
                <td class="py-3 font-medium">{{ order.id }}</td>
                <td class="py-3">{{ order.product }}</td>
                <td class="py-3">{{ order.package }}</td>
                <td class="py-3">${{ order.amount }}</td>
                <td class="py-3">{{ order.date }}</td>
                <td class="py-3">
                  <span :class="{
                    'px-2 py-1 rounded text-xs font-medium': true,
                    'bg-green-500/20 text-green-400': order.status === 'Completed' || order.status === 'Active',
                    'bg-yellow-500/20 text-yellow-400': order.status === 'Processing',
                    'bg-red-500/20 text-red-400': order.status === 'Failed'
                  }">
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-3">
                  <button class="text-blue-400 hover:text-blue-300 transition">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Support -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Need Help?</h2>
        <p class="text-gray-300 mb-4">If you have any questions or need assistance with your licenses, please contact our support team.</p>
        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
          Contact Support
        </button>
      </div>
    </div>
  </div>
</template> 