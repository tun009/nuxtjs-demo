<script setup>
definePageMeta({
  middleware: ['admin'],
  layout: 'admin'
});

const route = useRoute();
const productId = route.params.id;

// Form data với dữ liệu giả
const product = ref({
  id: productId,
  name: 'Product ' + productId,
  slug: 'product-' + productId,
  description: 'This is a detailed description for product ' + productId + '. It includes information about the product features, benefits, and use cases.',
  version: '1.0.' + productId,
  price: (99 + parseInt(productId) * 10).toString(),
  image: null,
  status: 'Active',
  features: [
    'Feature 1 for product ' + productId,
    'Feature 2 for product ' + productId,
    'Feature 3 for product ' + productId
  ]
});

// Tạo slug từ tên sản phẩm
const generateSlug = () => {
  product.value.slug = product.value.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Thêm feature mới
const addFeature = () => {
  product.value.features.push('');
};

// Xóa feature
const removeFeature = (index) => {
  product.value.features.splice(index, 1);
};

// Upload image
const fileInput = ref(null);
const previewImage = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    product.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Submit form
const isSubmitting = ref(false);
const router = useRouter();

const submitForm = async () => {
  isSubmitting.value = true;
  
  try {
    // Giả lập API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to products page
    router.push('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <div class="flex items-center mb-6">
      <NuxtLink to="/admin/products" class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <Icon name="heroicons:arrow-left" class="h-5 w-5" />
      </NuxtLink>
      <h1 class="text-2xl font-bold">Edit Product</h1>
    </div>
    
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium mb-4">Basic Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
            <input 
              id="name" 
              v-model="product.name" 
              @blur="generateSlug"
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="Enter product name" 
              required
            />
          </div>
          
          <div>
            <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
            <input 
              id="slug" 
              v-model="product.slug" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="product-slug" 
              required
            />
          </div>
          
          <div class="md:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              id="description" 
              v-model="product.description" 
              rows="4" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="Enter product description"
              required
            ></textarea>
          </div>
          
          <div>
            <label for="version" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Version</label>
            <input 
              id="version" 
              v-model="product.version" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="1.0.0" 
              required
            />
          </div>
          
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price ($)</label>
            <input 
              id="price" 
              v-model="product.price" 
              type="number" 
              min="0" 
              step="0.01" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="99.99" 
              required
            />
          </div>
          
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select 
              id="status" 
              v-model="product.status" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Image</label>
            <div 
              @click="triggerFileInput" 
              class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
            >
              <div class="space-y-1 text-center" v-if="!previewImage">
                <Icon name="heroicons:photo" class="mx-auto h-12 w-12 text-gray-400" />
                <div class="flex text-sm text-gray-600 dark:text-gray-400">
                  <label class="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                    <span>Upload a file</span>
                    <input 
                      ref="fileInput"
                      type="file" 
                      class="sr-only" 
                      accept="image/*"
                      @change="handleFileUpload"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <div v-else class="relative w-full h-40">
                <img :src="previewImage" class="h-full mx-auto object-contain" />
                <button 
                  type="button"
                  @click.stop="previewImage = null; product.image = null"
                  class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <Icon name="heroicons:x-mark" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Features -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">Features</h2>
          <button 
            type="button"
            @click="addFeature"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <Icon name="heroicons:plus-circle" class="h-5 w-5 mr-1" />
            Add Feature
          </button>
        </div>
        
        <div class="space-y-3">
          <div v-for="(feature, index) in product.features" :key="index" class="flex items-center">
            <input 
              v-model="product.features[index]" 
              type="text" 
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              placeholder="Enter product feature"
            />
            <button 
              type="button"
              @click="removeFeature(index)"
              class="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              :disabled="product.features.length === 1"
            >
              <Icon name="heroicons:trash" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Packages Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">License Packages</h2>
          <NuxtLink 
            :to="`/admin/products/${productId}/packages`" 
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
          >
            <Icon name="heroicons:pencil-square" class="h-5 w-5 mr-1" />
            Manage Packages
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="font-medium text-lg mb-1">Basic</div>
            <div class="text-2xl font-bold mb-2">$49<span class="text-sm font-normal text-gray-500">/year</span></div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">For individual users</div>
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>1 device</span>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Basic support</span>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>1 year updates</span>
              </div>
            </div>
          </div>
          
          <div class="border-2 border-blue-500 dark:border-blue-400 rounded-lg p-4 relative">
            <div class="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">Popular</div>
            <div class="font-medium text-lg mb-1">Professional</div>
            <div class="text-2xl font-bold mb-2">$99<span class="text-sm font-normal text-gray-500">/year</span></div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">For professional users</div>
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>3 devices</span>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Priority support</span>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>2 years updates</span>
              </div>
            </div>
          </div>
          
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="font-medium text-lg mb-1">Enterprise</div>
            <div class="text-2xl font-bold mb-2">$199<span class="text-sm font-normal text-gray-500">/year</span></div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">For enterprise users</div>
            <div class="space-y-2 mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Unlimited devices</span>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>24/7 support</span>
              </div>
              <div class="flex items-center">
                <Icon name="heroicons:check" class="h-5 w-5 text-green-500 mr-2" />
                <span>Lifetime updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Submit Buttons -->
      <div class="flex justify-end space-x-3">
        <NuxtLink 
          to="/admin/products" 
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
        >
          Cancel
        </NuxtLink>
        <button 
          type="submit" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
          :disabled="isSubmitting"
        >
          <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="h-5 w-5 mr-2 animate-spin" />
          <Icon v-else name="heroicons:check" class="h-5 w-5 mr-2" />
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template> 