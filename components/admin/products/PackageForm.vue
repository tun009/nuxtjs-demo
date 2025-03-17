<script setup>
/**
 * Component PackageForm để thêm package cho sản phẩm
 * 
 * Props:
 * - productId: ID của sản phẩm
 * - productName: Tên của sản phẩm
 * 
 * Events:
 * - success: Khi thêm package thành công
 * - cancel: Khi hủy thêm package
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
  name: '',
  price: '',
  price_unit: 'USD',
  limit_devices: 5,
  time_of_use: 12,
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
    if (!form.name) {
      errors.value.name = 'Name is required';
    }
    if (!form.price) {
      errors.value.price = 'Price is required';
    } else if (isNaN(form.price) || parseFloat(form.price) <= 0) {
      errors.value.price = 'Price must be a positive number';
    }
    if (!form.limit_devices || form.limit_devices <= 0) {
      errors.value.limit_devices = 'Device limit must be a positive number';
    }
    if (!form.time_of_use || form.time_of_use <= 0) {
      errors.value.time_of_use = 'Time of use must be a positive number';
    }

    // Nếu có lỗi, dừng lại
    if (Object.keys(errors.value).length > 0) {
      return;
    }
    
    // Gọi API để thêm package
    const response = await $api.post(`api/products/${props.productId}/packages`, {
      name: form.name,
      price: parseFloat(form.price),
      price_unit: form.price_unit,
      limit_devices: parseInt(form.limit_devices),
      time_of_use: parseInt(form.time_of_use),
      is_active: form.is_active,
      status: form.status
    });

    if (response.success) {
      // Reset form
      form.name = '';
      form.price = '';
      form.price_unit = 'USD';
      form.limit_devices = 5;
      form.time_of_use = 12;
      form.is_active = true;
      form.status = 'active';
      
      // Emit success event
      emit('success', response.data);
    } else {
      // Hiển thị lỗi từ API
      if (response.errors) {
        errors.value = response.errors;
      } else {
        errors.value.general = response.message || 'Failed to add package';
      }
    }
  } catch (error) {
    console.error('Error adding package:', error);
    errors.value.general = error.message || 'An error occurred while adding the package';
  } finally {
    loading.value = false;
  }
};

// Xử lý hủy
const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- Thông báo lỗi tổng -->
    <div v-if="errors.general" class="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
      {{ errors.general }}
    </div>

    <!-- Form fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Package Name -->
      <div class="col-span-2">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Name *</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="E.g. Basic Package"
          :class="{'border-red-500': errors.name}"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Price -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
        <input
          id="price"
          v-model="form.price"
          type="number"
          step="0.01"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="99.99"
          :class="{'border-red-500': errors.price}"
        />
        <p v-if="errors.price" class="mt-1 text-xs text-red-500">{{ errors.price }}</p>
      </div>

      <!-- Currency -->
      <div>
        <label for="price_unit" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
        <select
          id="price_unit"
          v-model="form.price_unit"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="VND">VND</option>
        </select>
      </div>

      <!-- Device Limit -->
      <div>
        <label for="limit_devices" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device Limit *</label>
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

      <!-- Time of Use (Months) -->
      <div>
        <label for="time_of_use" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time of Use (Months) *</label>
        <input
          id="time_of_use"
          v-model.number="form.time_of_use"
          type="number"
          min="1"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="12"
          :class="{'border-red-500': errors.time_of_use}"
        />
        <p v-if="errors.time_of_use" class="mt-1 text-xs text-red-500">{{ errors.time_of_use }}</p>
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
        <span v-else>Add Package</span>
      </button>
    </div>
  </form>
</template> 