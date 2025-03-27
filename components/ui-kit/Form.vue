<script setup>
import { ref, provide } from 'vue';

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  labelPosition: {
    type: String,
    default: 'right',
    validator: (val) => ['left', 'right', 'top'].includes(val)
  },
  labelWidth: {
    type: [String, Number],
    default: ''
  },
  labelSuffix: {
    type: String,
    default: ''
  },
  hideRequiredAsterisk: {
    type: Boolean,
    default: false
  },
  showMessage: {
    type: Boolean,
    default: true
  },
  inlineMessage: {
    type: Boolean,
    default: false
  },
  statusIcon: {
    type: Boolean,
    default: false
  },
  validateOnRuleChange: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default',
    validator: (val) => ['large', 'default', 'small'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  scrollToError: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['validate']);

const formRef = ref(null);

// Expose form methods to parent component
defineExpose({
  validate: (callback) => formRef.value?.validate(callback),
  validateField: (prop, cb) => formRef.value?.validateField(prop, cb),
  resetFields: () => formRef.value?.resetFields(),
  scrollToField: (prop) => formRef.value?.scrollToField(prop),
  clearValidate: (props) => formRef.value?.clearValidate(props)
});

// Provide form context to form items
provide('form', {
  model: props.model,
  rules: props.rules,
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  labelSuffix: props.labelSuffix,
  hideRequiredAsterisk: props.hideRequiredAsterisk,
  showMessage: props.showMessage,
  inlineMessage: props.inlineMessage,
  statusIcon: props.statusIcon,
  validateOnRuleChange: props.validateOnRuleChange,
  size: props.size,
  disabled: props.disabled,
  scrollToError: props.scrollToError
});

const handleValidate = (prop, isValid, message) => {
  emit('validate', prop, isValid, message);
};
</script>

<template>
  <el-form
    ref="formRef"
    :model="model"
    :rules="rules"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :label-suffix="labelSuffix"
    :hide-required-asterisk="hideRequiredAsterisk"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :status-icon="statusIcon"
    :validate-on-rule-change="validateOnRuleChange"
    :size="size"
    :disabled="disabled"
    :scroll-to-error="scrollToError"
    @validate="handleValidate"
  >
    <slot></slot>
  </el-form>
</template> 