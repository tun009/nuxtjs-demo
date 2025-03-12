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
  version: '1.0.' + productId,
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

// Form cho package mới
const newPackage = ref({
  name: '',
  price: '',
  period: 'year',
  description: '',
  features: [''],
  popular: false
});

// Thêm feature mới
const addFeature = (pkg) => {
  pkg.features.push('');
};

// Xóa feature
const removeFeature = (pkg, index) => {
  if (pkg.features.length > 1) {
    pkg.features.splice(index, 1);
  }
};

// Hiển thị form thêm mới
const showAddForm = ref(false);

// Thêm package mới
const addPackage = () => {
  // Validate
  if (!newPackage.value.name || !newPackage.value.price || !newPackage.value.description) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Thêm vào danh sách
  packages.value.push({
    id: packages.value.length + 1,
    name: newPackage.value.name,
    price: parseFloat(newPackage.value.price),
    period: newPackage.value.period,
    description: newPackage.value.description,
    features: newPackage.value.features.filter(f => f.trim() !== ''),
    popular: newPackage.value.popular
  });
  
  // Reset form
  newPackage.value = {
    name: '',
    price: '',
    period: 'year',
    description: '',
    features: [''],
    popular: false
  };
  
  // Ẩn form
  showAddForm.value = false;
};

// Xóa package
const deletePackage = (id) => {
  if (confirm('Are you sure you want to delete this package?')) {
    packages.value = packages.value.filter(pkg => pkg.id !== id);
  }
};

// Chỉnh sửa package
const editMode = ref({});
const editedPackages = ref({});

const startEdit = (pkg) => {
  editMode.value[pkg.id] = true;
  editedPackages.value[pkg.id] = JSON.parse(JSON.stringify(pkg));
};

const cancelEdit = (id) => {
  editMode.value[id] = false;
  delete editedPackages.value[id];
};

const saveEdit = (id) => {
  const index = packages.value.findIndex(pkg => pkg.id === id);
  if (index !== -1) {
    packages.value[index] = { ...editedPackages.value[id] };
    editMode.value[id] = false;
    delete editedPackages.value[id];
  }
};

// Lưu tất cả thay đổi
const router = useRouter();
const isSubmitting = ref(false);

const saveAllChanges = async () => {
  isSubmitting.value = true;
  
  try {
    // Giả lập API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to product detail
    router.push(`/admin/products/${productId}`);
  } catch (error) {
    console.error('Error saving packages:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <NuxtLink :to="`/admin/products/${productId}`" class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <Icon name="heroicons:arrow-left" class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">License Packages for {{ product.name }}</h1>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium">Current Packages</h2>
        <button 
          @click="showAddForm = true" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          v-if="!showAddForm"
        >
          <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
          Add Package
        </button>
      </div>
      
      <div class="space-y-6">
        <div 
          v-for="pkg in packages" 
          :key="pkg.id" 
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
        >
          <!-- View Mode -->
          <div v-if="!editMode[pkg.id]">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="flex items-center">
                  <h3 class="text-xl font-medium">{{ pkg.name }}</h3>
                  <span v-if="pkg.popular" class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    Popular
                  </span>
                </div>
                <div class="text-2xl font-bold mt-1">${{ pkg.price }}<span class="text-sm font-normal text-gray-500">/{{ pkg.period }}</span></div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ pkg.description }}</div>
              </div>
              <div class="flex space-x-2">
                <button @click="startEdit(pkg)" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  <Icon name="heroicons:pencil-square" class="h-5 w-5" />
                </button>
                <button @click="deletePackage(pkg.id)" class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <Icon name="heroicons:trash" class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Features</h4>
              <ul class="space-y-2">
                <li v-for="(feature, idx) in pkg.features" :key="idx" class="flex items-center">
                  <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Edit Mode -->
          <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Name</label>
                <input 
                  v-model="editedPackages[pkg.id].name" 
                  type="text" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                <div class="flex">
                  <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">$</span>
                  <input 
                    v-model="editedPackages[pkg.id].price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                    required
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
                <select 
                  v-model="editedPackages[pkg.id].period" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input 
                  v-model="editedPackages[pkg.id].description" 
                  type="text" 
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                  required
                />
              </div>
              
              <div class="md:col-span-2">
                <div class="flex items-center">
                  <input 
                    id="popular" 
                    v-model="editedPackages[pkg.id].popular" 
                    type="checkbox" 
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label for="popular" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mark as Popular</label>
                </div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
                <button 
                  type="button"
                  @click="addFeature(editedPackages[pkg.id])"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                >
                  <Icon name="heroicons:plus-circle" class="h-4 w-4 mr-1" />
                  Add Feature
                </button>
              </div>
              
              <div class="space-y-2">
                <div v-for="(feature, idx) in editedPackages[pkg.id].features" :key="idx" class="flex items-center">
                  <input 
                    v-model="editedPackages[pkg.id].features[idx]" 
                    type="text" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
                    placeholder="Enter feature"
                  />
                  <button 
                    type="button"
                    @click="removeFeature(editedPackages[pkg.id], idx)"
                    class="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    :disabled="editedPackages[pkg.id].features.length === 1"
                  >
                    <Icon name="heroicons:trash" class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-2 mt-4">
              <button 
                @click="cancelEdit(pkg.id)" 
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button 
                @click="saveEdit(pkg.id)" 
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No packages message -->
      <div v-if="packages.length === 0" class="text-center py-8">
        <Icon name="heroicons:tag" class="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">No Packages Yet</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Add your first license package to start selling this product.</p>
        <button 
          @click="showAddForm = true" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <Icon name="heroicons:plus" class="h-5 w-5 mr-2" />
          Add Package
        </button>
      </div>
    </div>
    
    <!-- Add New Package Form -->
    <div v-if="showAddForm" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h2 class="text-lg font-medium mb-4">Add New Package</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Name</label>
          <input 
            v-model="newPackage.name" 
            type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
            placeholder="e.g. Basic, Professional, Enterprise"
            required
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
          <div class="flex">
            <span class="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">$</span>
            <input 
              v-model="newPackage.price" 
              type="number" 
              min="0" 
              step="0.01" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="99.99"
              required
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period</label>
          <select 
            v-model="newPackage.period" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="month">Month</option>
            <option value="year">Year</option>
            <option value="lifetime">Lifetime</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <input 
            v-model="newPackage.description" 
            type="text" 
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
            placeholder="e.g. For individual users"
            required
          />
        </div>
        
        <div class="md:col-span-2">
          <div class="flex items-center">
            <input 
              id="newPopular" 
              v-model="newPackage.popular" 
              type="checkbox" 
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="newPopular" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mark as Popular</label>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Features</label>
          <button 
            type="button"
            @click="addFeature(newPackage)"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
          >
            <Icon name="heroicons:plus-circle" class="h-4 w-4 mr-1" />
            Add Feature
          </button>
        </div>
        
        <div class="space-y-2">
          <div v-for="(feature, idx) in newPackage.features" :key="idx" class="flex items-center">
            <input 
              v-model="newPackage.features[idx]" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="e.g. 1 device, Basic support, etc."
            />
            <button 
              type="button"
              @click="removeFeature(newPackage, idx)"
              class="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              :disabled="newPackage.features.length === 1"
            >
              <Icon name="heroicons:trash" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2">
        <button 
          @click="showAddForm = false" 
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
        >
          Cancel
        </button>
        <button 
          @click="addPackage" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Add Package
        </button>
      </div>
    </div>
    
    <!-- Save All Changes Button -->
    <div class="flex justify-end">
      <button 
        @click="saveAllChanges" 
        class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
        :disabled="isSubmitting"
      >
        <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="h-5 w-5 mr-2 animate-spin" />
        <Icon v-else name="heroicons:check" class="h-5 w-5 mr-2" />
        {{ isSubmitting ? 'Saving...' : 'Save All Changes' }}
      </button>
    </div>
  </div>
</template> 