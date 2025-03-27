<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '30%'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  top: {
    type: String,
    default: '15vh'
  },
  modal: {
    type: Boolean,
    default: true
  },
  lockScroll: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  closeOnClickModal: {
    type: Boolean,
    default: true
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  center: {
    type: Boolean,
    default: false
  },
  destroyOnClose: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'open', 'opened', 'close', 'closed']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  visible.value = newValue;
});

watch(() => visible.value, (newValue) => {
  emit('update:modelValue', newValue);
});

const handleOpen = () => {
  emit('open');
};

const handleOpened = () => {
  emit('opened');
};

const handleClose = () => {
  emit('close');
};

const handleClosed = () => {
  emit('closed');
};
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :fullscreen="fullscreen"
    :top="top"
    :modal="modal"
    :lock-scroll="lockScroll"
    :custom-class="customClass"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :show-close="showClose"
    :center="center"
    :destroy-on-close="destroyOnClose"
    @open="handleOpen"
    @opened="handleOpened"
    @close="handleClose"
    @closed="handleClosed"
  >
    <template #header v-if="$slots.header">
      <slot name="header"></slot>
    </template>
    
    <slot></slot>
    
    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-dialog {
  @apply dark:bg-gray-800 dark:text-white;
}
</style> 