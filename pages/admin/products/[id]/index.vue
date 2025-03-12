<script setup>
definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
});

const route = useRoute();
const productId = route.params.id;

// Dữ liệu giả cho sản phẩm
const product = ref({
  id: productId,
  name: 'Product ' + productId,
  slug: 'product-' + productId,
  description: 'This is a detailed description for product ' + productId + '. It includes information about the product features, benefits, and use cases.',
  version: '1.0.' + productId,
  price: 99 + parseInt(productId) * 10,
  image: null,
  status: 'Active',
  features: [
    'Feature 1 for product ' + productId,
    'Feature 2 for product ' + productId,
    'Feature 3 for product ' + productId
  ],
  created: '2024-01-15',
  updated: '2024-06-20',
  stats: {
    totalSales: 125,
    totalRevenue: 12350,
    activeUsers: 98,
    rating: 4.7
  }
});

// Dữ liệu giả cho các gói license
const packages = ref([
  {
    id: 1,
    name: 'Basic',
    price: 49,
    period: 'year',
    description: 'For individual users',
    features: ['1 device', 'Basic support', '1 year updates'],
    popular: false
  },
  {
    id: 2,
    name: 'Professional',
    price: 99,
    period: 'year',
    description: 'For professional users',
    features: ['3 devices', 'Priority support', '2 years updates'],
    popular: true
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 199,
    period: 'year',
    description: 'For enterprise users',
    features: ['Unlimited devices', '24/7 support', 'Lifetime updates'],
    popular: false
  }
]);

// Dữ liệu giả cho lịch sử đơn hàng
const orders = ref([
  { id: 'ORD-1001', user: 'John Doe', package: 'Professional', amount: 99, date: '2024-06-15', status: 'Completed' },
  { id: 'ORD-1002', user: 'Jane Smith', package: 'Basic', amount: 49, date: '2024-06-10', status: 'Completed' },
  { id: 'ORD-1003', user: 'Robert Johnson', package: 'Enterprise', amount: 199, date: '2024-06-05', status: 'Completed' },
  { id: 'ORD-1004', user: 'Emily Davis', package: 'Professional', amount: 99, date: '2024-05-28', status: 'Completed' },
  { id: 'ORD-1005', user: 'Michael Brown', package: 'Basic', amount: 49, date: '2024-05-20', status: 'Completed' }
]);

// Xóa sản phẩm
const router = useRouter();
const deleteProduct = () => {
  if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    // Giả lập API call
    setTimeout(() => {
      router.push('/admin/products');
    }, 500);
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <NuxtLink to="/admin/products" class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        </NuxtLink>
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <span class="ml-3 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          {{ product.status }}
        </span>
      </div>
      <div class="flex space-x-2">
        <NuxtLink :to="`/admin/products/${productId}/edit`" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Icon name="heroicons:pencil-square" class="h-5 w-5 mr-2" />
          Edit
        </NuxtLink>
        <button @click="deleteProduct" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Icon name="heroicons:trash" class="h-5 w-5 mr-2" />
          Delete
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Product Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</div>
              <div>{{ product.name }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</div>
              <div>{{ product.slug }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Version</div>
              <div>{{ product.version }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Base Price</div>
              <div>${{ product.price.toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</div>
              <div>{{ product.created }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</div>
              <div>{{ product.updated }}</div>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</div>
            <div class="text-gray-700 dark:text-gray-300">{{ product.description }}</div>
          </div>
          
          <div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Features</div>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(feature, index) in product.features" :key="index" class="text-gray-700 dark:text-gray-300">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
        
        <!-- License Packages -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">License Packages</h2>
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
                pkg.popular ? 'border-2 border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'
              ]"
              class="relative"
            >
              <div v-if="pkg.popular" class="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">Popular</div>
              <div class="font-medium text-lg mb-1">{{ pkg.name }}</div>
              <div class="text-2xl font-bold mb-2">${{ pkg.price }}<span class="text-sm font-normal text-gray-500">{{ '/' + pkg.period }}</span></div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ pkg.description }}</div>
              <div class="space-y-2 mb-4">
                <div v-for="(feature, idx) in pkg.features" :key="idx" class="flex items-center">
                  <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                  <span>{{ feature }}</span>
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
                  <th class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                  <th class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Package</th>
                  <th class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ order.id }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ order.user }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ order.package }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${{ order.amount }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ order.date }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="mt-4 text-center">
            <NuxtLink to="/admin/orders" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
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
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</div>
                <div class="text-sm font-medium">{{ product.stats.totalSales }}</div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-1">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</div>
                <div class="text-sm font-medium">${{ product.stats.totalRevenue.toLocaleString() }}</div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 65%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-1">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</div>
                <div class="text-sm font-medium">{{ product.stats.activeUsers }}</div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-purple-500 h-2 rounded-full" style="width: 80%"></div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-1">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</div>
                <div class="text-sm font-medium">{{ product.stats.rating }}/5</div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 90%"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Quick Actions</h2>
          
          <div class="space-y-3">
            <NuxtLink :to="`/admin/products/${productId}/edit`" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                <Icon name="heroicons:pencil-square" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-medium">Edit Product</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Update product information</div>
              </div>
            </NuxtLink>
            
            <NuxtLink :to="`/admin/products/${productId}/packages`" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                <Icon name="heroicons:tag" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-medium">Manage Packages</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">Edit license packages</div>
              </div>
            </NuxtLink>
            
            <NuxtLink to="/admin/orders" class="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 mr-3">
                <Icon name="heroicons:shopping-cart" class="h-5 w-5" />
              </div>
              <div>
                <div class="text-sm font-medium">View Orders</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">See all product orders</div>
              </div>
            </NuxtLink>
            
            <button @click="deleteProduct" class="w-full flex items-center p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">
              <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-300 mr-3">
                <Icon name="heroicons:trash" class="h-5 w-5" />
              </div>
              <div class="text-left">
                <div class="text-sm font-medium">Delete Product</div>
                <div class="text-xs text-red-500 dark:text-red-400">Remove this product</div>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Preview -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium mb-4">Preview</h2>
          
          <div class="text-center">
            <div class="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Icon name="heroicons:cube" class="h-12 w-12 text-blue-600 dark:text-blue-300" />
            </div>
            
            <div class="text-lg font-medium mb-1">{{ product.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">Version {{ product.version }}</div>
            
            <NuxtLink :to="`/products/${product.id}`" target="_blank" class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Icon name="heroicons:eye" class="h-5 w-5 mr-2" />
              View Public Page
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 