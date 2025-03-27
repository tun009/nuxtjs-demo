<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Please select'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  filterable: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  remote: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  }
});

const emit = defineEmits(['update:modelValue', 'change', 'visible-change', 'clear', 'blur', 'focus']);

const handleChange = (value) => {
  emit('update:modelValue', value);
  emit('change', value);
};

const handleVisibleChange = (visible) => {
  emit('visible-change', visible);
};

const handleClear = () => {
  emit('clear');
};

const handleBlur = (event) => {
  emit('blur', event);
};

const handleFocus = (event) => {
  emit('focus', event);
};
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label }}</label>
    <el-select
      :model-value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :multiple="multiple"
      :filterable="filterable"
      :size="size"
      :loading="loading"
      :remote="remote"
      class="w-full"
      @change="handleChange"
      @visible-change="handleVisibleChange"
      @clear="handleClear"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <el-option
        v-for="option in options"
        :key="option[valueKey]"
        :label="option[labelKey]"
        :value="option[valueKey]"
        :disabled="option.disabled"
      />
    </el-select>
    <div v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</div>
  </div>
</template> 