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
  email: '',
  name: '',
  max_devices: 5,
  expiry_date: '',
  is_active: true,
  status: 'active'
});

// Validation
const errors = ref({});
const loading = ref(false);

// Xử lý submit form
const handleSubmit = async () => {
  try {
    loading.value = true;
    errors.value = {};

    // Validate form
    if (!form.email) {
      errors.value.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.value.email = 'Invalid email format';
    }
    
    if (!form.name) {
      errors.value.name = 'Name is required';
    }
    
    if (!form.max_devices || form.max_devices <= 0) {
      errors.value.max_devices = 'Max devices must be a positive number';
    }
    
    if (!form.expiry_date) {
      errors.value.expiry_date = 'Expiry date is required';
    }

    // Nếu có lỗi, dừng lại
    if (Object.keys(errors.value).length > 0) {
      return;
    }
    
    // Gọi API để thêm license
    const response = await $api.post(`api/products/${props.productId}/licenses`, {
      email: form.email,
      name: form.name,
      max_devices: parseInt(form.max_devices),
      expiry_date: form.expiry_date,
      is_active: form.is_active,
      status: form.status
    });

    if (response.success) {
      // Reset form
      form.email = '';
      form.name = '';
      form.max_devices = 5;
      form.expiry_date = '';
      form.is_active = true;
      form.status = 'active';
      
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

// Xử lý hủy
const handleCancel = () => {
  emit('cancel');
};

// Tính toán ngày hết hạn tối thiểu (ngày hiện tại)
const minExpiryDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Thiết lập ngày mặc định (1 năm sau)
onMounted(() => {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  form.expiry_date = oneYearFromNow.toISOString().split('T')[0];
});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Thông báo lỗi tổng -->
    <div v-if="errors.general" class="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
      {{ errors.general }}
    </div>

    <!-- Form fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Email -->
      <div class="col-span-2">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="user@example.com"
          :class="{'border-red-500': errors.email}"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
      </div>

      <!-- License Name / User Name -->
      <div class="col-span-2">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="John Doe"
          :class="{'border-red-500': errors.name}"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Max Devices -->
      <div>
        <label for="max_devices" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Devices *</label>
        <input
          id="max_devices"
          v-model.number="form.max_devices"
          type="number"
          min="1"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="5"
          :class="{'border-red-500': errors.max_devices}"
        />
        <p v-if="errors.max_devices" class="mt-1 text-xs text-red-500">{{ errors.max_devices }}</p>
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

      <!-- Status -->
      <div class="col-span-2">
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