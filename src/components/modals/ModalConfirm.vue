<script setup lang="js">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmation'
  },
  message: {
    type: String,
    default: ''
  },
  confirmLabel: {
    type: String,
    default: 'Valider'
  },
  cancelLabel: {
    type: String,
    default: 'Annuler'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close']);

const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};

const onConfirm = () => {
  emit('confirm');
  closeModal();
};

const onCancel = () => {
  emit('cancel');
  closeModal();
};

const actions = computed(() => [
  {
    label: props.confirmLabel,
    onClick() {
      onConfirm();
    }
  },
  {
    label: props.cancelLabel,
    tertiary: true,
    onClick() {
      onCancel();
    }
  }
]);
</script>

<template>
  <DsfrModal
    :opened="modelValue"
    :title="title"
    size="md"
    :is-alert="true"
    :actions="actions"
    @close="onCancel"
  >
    <template #default>
      <p>{{ message }}</p>
      <slot />
    </template>
  </DsfrModal>
</template>