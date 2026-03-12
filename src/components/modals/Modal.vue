<template>
  <DsfrModal
    opened
    :title="title"
    :size="size"
    @close="onClose"
  >
    <slot />
  </DsfrModal>
</template>

<script setup>
import { useModals } from '@/composables/useModals';
let modals = useModals();

let props = defineProps({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
  },
});

let onClose = () => {
  modals.close(props.name);
};
</script>
