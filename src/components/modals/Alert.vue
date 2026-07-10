<template>
  <DsfrAlert
    :class="{ 'fr-alert--dismissible': dismissible }"
    :type="type"
    :title="title"
    :small="small"
    closeable
    :closed="closed"
    @close="onCloseAlert"
  >
    <div class="content">
      <slot />
    </div>

    <div
      v-if="dismissible"
      class="checkbox-container fr-mt-2v"
    >
      <DsfrCheckbox
        v-model="askDismiss"
        class="fr-mt-8w"
        value="valeur 1"
        name="checkbox-simple"
        label="Ne plus afficher"
        small
        inline
      />
    </div>
  </DsfrAlert>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  small: {
    type: Boolean,
    default: false,
  },
  dismissible: {
    type: Boolean,
    default: false,
  }
});

let emit = defineEmits(['dismiss']);

// etat open/close
let closed = ref(false);
let onCloseAlert = () => {
  closed.value = true;

  if (askDismiss.value) {
    onDismiss();
  }
};

// ne plus afficher ?
let askDismiss = ref(false);
let onDismiss = () => emit('dismiss');
</script>

<style scoped lang="scss">
@use "@/assets/variables" as *;

.fr-alert {
  background-color: var(--background-default-grey);
  margin-top: 0;
}
@include max(md) {
  .fr-alert--dismissible {
    padding-top: 3rem;
  }
}
@include min(md) {
  .fr-alert--dismissible .content {
    width: calc(100% - 12rem);
  }
}
.checkbox-container {
  position: absolute;
  top: 0;
  right: 2.5rem;
}
</style>
