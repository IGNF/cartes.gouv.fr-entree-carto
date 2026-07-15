<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Legends } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: {
    type: String,
    required: true
  },
  visibility: Boolean,
  analytic: Boolean,
  legendsOptions: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['ready']);

const map = inject(props.mapId);
const legends = ref(new Legends(props.legendsOptions));

onMounted(() => {
  emit('ready');
  if (props.visibility) {
    map.addControl(legends.value);
    if (props.analytic) {
      var el = legends.value.element.querySelector("button[id^=GPshowLegendsPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(legends.value);
    if (props.analytic) {
      var el = legends.value.element.querySelector("button[id^=GPshowLegendsPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(legends.value);
  }
})

watch(
  () => props.visibility,
  (visible) => {
    if (visible) {
      emit('ready');
    }
  }
);

</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

// pas de bouton legende en mobile
// mais le panel reste activable via contextmenu
// donc on annule aussi la marge
.gpf-widget[id^="GPlegends-"] {
  @include max(sm) {
    margin-top: -$gap;

    & > .gpf-btn-icon {
      display: none;
    }
  }
}
</style>
