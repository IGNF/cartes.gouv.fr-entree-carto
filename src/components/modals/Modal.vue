<template>
  <DsfrModal
    opened
    :title="title"
    :size="size"
    @close="onClose"
  >
    <slot />

    <template
      v-if="dismissible"
      #footer
    >
      <DsfrCheckbox
        v-model="askDismiss"
        value="valeur 1"
        name="checkbox-simple"
        label="Ne plus afficher"
        small
        inline
      />
    </template>
  </DsfrModal>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';

import { useAppStore } from '@/stores/appStore';
let appStore = useAppStore();

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
  dismissible: {
    type: Boolean,
    default: false,
  },
});

let onClose = () => {
  modals.close(props.name);

  if (askDismiss.value) {
    onDismiss(props.name);
  }
};

// emet close juste avant la destruction du composant
onBeforeUnmount(() => {
  onClose();
});

// ne plus afficher ?
let askDismiss = ref(false);
// stocke les modales "ne plus afficher"
let onDismiss = (modalName) => {
  let dismissibleModals = [];
  if (localStorage.getItem(appStore.ns('modals'))) {
    dismissibleModals = JSON.parse(localStorage.getItem(appStore.ns('modals')));
  }

  // on push dans local storage (sans doublons)
  if (!dismissibleModals.includes(modalName)) {
    dismissibleModals.push(modalName);
  }
  localStorage.setItem(appStore.ns('modals'), JSON.stringify(dismissibleModals));
}
</script>

<style lang="scss">
@use "@/assets/variables" as *;

.fr-modal__footer {
  align-items: center;

  @include max(lg) {
    flex-direction: column-reverse;
  }
}

</style>

<style scoped lang="scss">
@use "@/assets/variables" as *;

.fr-fieldset__element {
  margin: 0;

  @include max(lg) {
    margin-top: 1rem;
  }
}
</style>
