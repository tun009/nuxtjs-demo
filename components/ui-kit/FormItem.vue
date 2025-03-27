<script setup>
const props = defineProps({
  prop: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  labelWidth: {
    type: [String, Number],
    default: ''
  },
  required: {
    type: Boolean,
    default: undefined
  },
  rules: {
    type: [Object, Array],
    default: () => {}
  },
  error: {
    type: String,
    default: ''
  },
  showMessage: {
    type: Boolean,
    default: true
  },
  inlineMessage: {
    type: Boolean,
    default: undefined
  },
  size: {
    type: String,
    default: '',
    validator: (val) => ['', 'large', 'default', 'small'].includes(val)
  }
});
</script>

<template>
  <el-form-item
    :prop="prop"
    :label="label"
    :label-width="labelWidth"
    :required="required"
    :rules="rules"
    :error="error"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :size="size"
  >
    <slot></slot>
  </el-form-item>
</template> 