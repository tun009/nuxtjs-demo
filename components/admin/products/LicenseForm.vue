<script setup>
/**
 * Component LicenseForm để thêm license cho sản phẩm
 * 
 * Props:
 * - productId: ID của sản phẩm
 * - productName: Tên của sản phẩm
 * 
 * Events:
 * - success: Khi thêm license thành công
 * - cancel: Khi hủy thêm license
 */

const props = defineProps({
  // ID của sản phẩm
  productId: {
    type: [Number, String],
    required: true
  },
  // Tên của sản phẩm
  productName: {
    type: String,
    default: ''
  }
});

// Emit events
const emit = defineEmits(['success', 'cancel']);

// API
const { $api } = useNuxtApp();

// Form data
const form = reactive({
  license_code: generateLicenseCode(),
  limit_devices: 5,
  expiry_date: '',
  is_active: true,
  status: 'active',
  owner_id: null,
  rel_package_id: null,
  meta_data: {}
});

// Danh sách users
const users = ref([]);
const loadingUsers = ref(false);
const userError = ref(null);
const userSearchQuery = ref('');
const showUserDropdown = ref(false);

// Danh sách packages
const packages = ref([]);
const loadingPackages = ref(false);
const packageError = ref(null);

// Meta data items
const metaItems = ref([
  { key: 'key', value: 'value' }
]);

// Validation
const errors = ref({});
const loading = ref(false);

// Placeholder avatar khi không có avatar
const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

// Sinh mã license ngẫu nhiên
function generateLicenseCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const sections = [3, 3, 3]; // Các section 3-3-3 ký tự
  let code = '';
  
  sections.forEach((length, index) => {
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (index < sections.length - 1) {
      code += '-';
    }
  });
  
  return code;
}

// Tạo license code mới
function refreshLicenseCode() {
  form.license_code = generateLicenseCode();
}

// Thêm meta item mới
function addMetaItem() {
  metaItems.value.push({ key: '', value: '' });
}

// Xóa meta item
function removeMetaItem(index) {
  metaItems.value.splice(index, 1);
}

// Cập nhật meta_data từ metaItems
function updateMetaData() {
  const metaData = {};
  metaItems.value.forEach(item => {
    if (item.key.trim()) {
      metaData[item.key] = item.value;
    }
  });
  form.meta_data = metaData;
}

// Kiểm tra meta data có lỗi không
function validateMetaData() {
  const errors = {};
  let hasError = false;
  
  metaItems.value.forEach((item, index) => {
    if (!item.key.trim()) {
      errors[`metaKey_${index}`] = 'Key is required';
      hasError = true;
    }
  });
  
  return { hasError, errors };
}

// Cập nhật meta_data khi metaItems thay đổi
watch(metaItems, () => {
  updateMetaData();
}, { deep: true });

// Tìm kiếm người dùng
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) {
    return users.value;
  }
  
  const query = userSearchQuery.value.toLowerCase();
  return users.value.filter(user => 
    (user.name && user.name.toLowerCase().includes(query)) || 
    (user.email && user.email.toLowerCase().includes(query))
  );
});

// Fetch danh sách users
const fetchUsers = async () => {
  loadingUsers.value = true;
  userError.value = null;
  
  try {
    const response = await $api.get('api/user/list', {
      params: {
        per_page: 1000 // Lấy số lượng lớn để đảm bảo lấy tất cả
      }
    });
    
    if (response.success) {
      users.value = response.data.data || response.data;
    } else {
      userError.value = response.message || 'Failed to fetch users';
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    userError.value = error.message || 'An error occurred while fetching users';
  } finally {
    loadingUsers.value = false;
  }
};

// Fetch danh sách packages của sản phẩm
const fetchPackages = async () => {
  loadingPackages.value = true;
  packageError.value = null;
  
  try {
    const response = await $api.get(`api/products/${props.productId}/packages`);
    
    if (response.success) {
      packages.value = response.data.data || response.data;
    } else {
      packageError.value = response.message || 'Failed to fetch packages';
    }
  } catch (error) {
    console.error('Error fetching packages:', error);
    packageError.value = error.message || 'An error occurred while fetching packages';
  } finally {
    loadingPackages.value = false;
  }
};

// Xử lý khi chọn user
const handleUserSelect = (user) => {
  form.owner_id = user.id;
  showUserDropdown.value = false;
  userSearchQuery.value = user.name || user.email || '';
};

// Lấy tên user đã chọn
const selectedUserName = computed(() => {
  if (!form.owner_id) return '';
  const user = users.value.find(u => u.id === form.owner_id);
  return user ? user.name : '';
});

// Xử lý submit form
const handleSubmit = async () => {
  try {
    loading.value = true;
    errors.value = {};

    // Validate form
    if (!form.owner_id) {
      errors.value.owner_id = 'User is required';
    }
    
    if (!form.rel_package_id) {
      errors.value.rel_package_id = 'Package is required';
    }
    
    if (!form.license_code) {
      errors.value.license_code = 'License code is required';
    }
    
    if (!form.limit_devices || form.limit_devices <= 0) {
      errors.value.limit_devices = 'Max devices must be a positive number';
    }
    
    if (!form.expiry_date) {
      errors.value.expiry_date = 'Expiry date is required';
    }
    
    // Validate meta data
    const metaValidation = validateMetaData();
    if (metaValidation.hasError) {
      errors.value = { ...errors.value, ...metaValidation.errors };
    }

    // Nếu có lỗi, dừng lại
    if (Object.keys(errors.value).length > 0) {
      return;
    }

    // Cập nhật meta_data trước khi gửi
    updateMetaData();
    
    // Gọi API để thêm license
    const response = await $api.post(`api/products/${props.productId}/licenses`, {
      license_code: form.license_code,
      limit_devices: parseInt(form.limit_devices),
      expired_at: form.expiry_date,
      is_active: form.is_active,
      status: form.status,
      owner_id: parseInt(form.owner_id),
      rel_package_id: parseInt(form.rel_package_id),
      meta_data: form.meta_data
    });

    if (response.success) {
      // Reset form
      form.license_code = generateLicenseCode();
      form.limit_devices = 5;
      form.expiry_date = '';
      form.is_active = true;
      form.status = 'active';
      form.owner_id = null;
      form.rel_package_id = null;
      form.meta_data = {};
      metaItems.value = [{ key: 'key', value: 'value' }];
      userSearchQuery.value = '';
      
      // Emit success event
      emit('success', response.data);
    } else {
      // Hiển thị lỗi từ API
      if (response.errors) {
        errors.value = response.errors;
      } else {
        errors.value.general = response.message || 'Failed to add license';
      }
    }
  } catch (error) {
    console.error('Error adding license:', error);
    errors.value.general = error.message || 'An error occurred while adding the license';
  } finally {
    loading.value = false;
  }
};

// Xử lý click bên ngoài dropdown
const userSelectRef = ref(null);
const closeDropdownOnOutsideClick = (event) => {
  if (userSelectRef.value && !userSelectRef.value.contains(event.target)) {
    showUserDropdown.value = false;
  }
};

// Đăng ký event listener khi component được mount
onMounted(() => {
  window.addEventListener('click', closeDropdownOnOutsideClick);
});

// Hủy event listener khi component bị hủy
onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnOutsideClick);
});

// Xử lý hủy
const handleCancel = () => {
  emit('cancel');
};

// Tính toán ngày hết hạn tối thiểu (ngày hiện tại)
const minExpiryDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Thiết lập ngày mặc định (1 năm sau) và fetch dữ liệu
onMounted(() => {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  form.expiry_date = oneYearFromNow.toISOString().split('T')[0];
  
  // Cập nhật meta_data ban đầu
  updateMetaData();
  
  // Fetch danh sách users và packages
  fetchUsers();
  fetchPackages();
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Thông báo lỗi tổng -->
    <div v-if="errors.general" class="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
      {{ errors.general }}
    </div>

    <!-- Form fields -->
    <div class="grid grid-cols-1 gap-4">
      <!-- User Select - Custom with Search -->
      <div ref="userSelectRef" class="relative">
        <label for="userSearch" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User *</label>
        <div class="relative">
          <input
            id="userSearch"
            v-model="userSearchQuery"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search users by name or email"
            @focus="showUserDropdown = true"
            :class="{'border-red-500': errors.owner_id}"
            autocomplete="off"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button 
              type="button" 
              class="text-gray-400 focus:outline-none"
              @click="showUserDropdown = !showUserDropdown"
            >
              <Icon 
                :name="showUserDropdown ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                class="w-5 h-5"
              />
            </button>
          </div>
        </div>
        
        <!-- User dropdown -->
        <div 
          v-if="showUserDropdown" 
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <div v-if="loadingUsers" class="flex items-center justify-center py-4">
            <Icon name="heroicons:arrow-path" class="w-5 h-5 text-blue-500 animate-spin mr-2" />
            <span class="text-gray-500">Loading users...</span>
          </div>
          
          <div v-else-if="userError" class="px-4 py-2 text-sm text-red-500">
            {{ userError }}
          </div>
          
          <div v-else-if="filteredUsers.length === 0" class="px-4 py-2 text-sm text-gray-500">
            No users found
          </div>
          
          <ul v-else class="py-1">
            <li 
              v-for="user in filteredUsers" 
              :key="user.id" 
              class="relative cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2"
              @click="handleUserSelect(user)"
            >
              <div class="flex items-center">
                <img 
                  :src="user.avatar || defaultAvatar" 
                  :alt="user.name || 'User avatar'"
                  class="h-8 w-8 rounded-full mr-3 object-cover"
                />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <p v-if="errors.owner_id" class="mt-1 text-xs text-red-500">{{ errors.owner_id }}</p>
      </div>

      <!-- Package Select -->
      <div>
        <label for="rel_package_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package *</label>
        <div class="relative">
          <select
            id="rel_package_id"
            v-model="form.rel_package_id"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-3 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            :class="{'border-red-500': errors.rel_package_id}"
            :disabled="loadingPackages"
          >
            <option value="" disabled selected>Select a package</option>
            <template v-if="!loadingPackages && !packageError">
              <option v-for="pkg in packages" :key="pkg.id" :value="pkg.id">
                {{ pkg.name }} - {{ new Intl.NumberFormat('en-US', { style: 'currency', currency: pkg.price_unit || 'USD' }).format(pkg.price) }}
              </option>
            </template>
            <option v-if="loadingPackages" disabled>Loading packages...</option>
            <option v-if="packageError" disabled>Error loading packages</option>
          </select>
          <div v-if="loadingPackages" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon name="heroicons:arrow-path" class="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        </div>
        <p v-if="errors.rel_package_id" class="mt-1 text-xs text-red-500">{{ errors.rel_package_id }}</p>
        <p v-if="packageError" class="mt-1 text-xs text-red-500">{{ packageError }}</p>
      </div>

      <!-- License Code -->
      <div>
        <label for="license_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Code *</label>
        <div class="flex">
          <input
            id="license_code"
            v-model="form.license_code"
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="XXX-XXX-XXX"
            :class="{'border-red-500': errors.license_code}"
          />
          <button
            type="button"
            class="px-4 py-2.5 text-sm font-medium bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            @click="refreshLicenseCode"
          >
            <Icon name="heroicons:arrow-path" class="w-5 h-5" />
          </button>
        </div>
        <p v-if="errors.license_code" class="mt-1 text-xs text-red-500">{{ errors.license_code }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Max Devices -->
        <div>
          <label for="limit_devices" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Devices *</label>
          <input
            id="limit_devices"
            v-model.number="form.limit_devices"
            type="number"
            min="1"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="5"
            :class="{'border-red-500': errors.limit_devices}"
          />
          <p v-if="errors.limit_devices" class="mt-1 text-xs text-red-500">{{ errors.limit_devices }}</p>
        </div>

        <!-- Expiry Date -->
        <div>
          <label for="expiry_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date *</label>
          <input
            id="expiry_date"
            v-model="form.expiry_date"
            type="date"
            :min="minExpiryDate"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            :class="{'border-red-500': errors.expiry_date}"
          />
          <p v-if="errors.expiry_date" class="mt-1 text-xs text-red-500">{{ errors.expiry_date }}</p>
        </div>
      </div>

      <!-- Meta Data -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Meta Data</label>
          <button
            type="button"
            class="flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
            @click="addMetaItem"
          >
            <Icon name="heroicons:plus" class="w-3 h-3 mr-1" />
            Add Field
          </button>
        </div>
        
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 space-y-3">
          <div 
            v-for="(item, index) in metaItems" 
            :key="index" 
            class="flex items-center gap-2"
          >
            <div class="flex-1">
              <input
                v-model="item.key"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Key"
                :class="{'border-red-500': errors[`metaKey_${index}`]}"
              />
              <p v-if="errors[`metaKey_${index}`]" class="mt-1 text-xs text-red-500">{{ errors[`metaKey_${index}`] }}</p>
            </div>
            <div class="flex-1">
              <input
                v-model="item.value"
                type="text"
                class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Value"
              />
            </div>
            <div>
              <button
                type="button"
                class="p-2.5 text-red-500 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:hover:bg-red-900/20"
                @click="removeMetaItem(index)"
                :disabled="metaItems.length === 1"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <p>Current Meta Data:</p>
            <code class="block mt-1 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">{{ JSON.stringify(form.meta_data, null, 2) }}</code>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div>
        <div class="flex items-center">
          <input
            id="is_active"
            v-model="form.is_active"
            type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label for="is_active" class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end mt-6 space-x-3">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        @click="handleCancel"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
        :disabled="loading"
      >
        <span v-if="loading" class="flex items-center">
          <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
          Adding...
        </span>
        <span v-else>Add License</span>
      </button>
    </div>
  </form>
</template> 