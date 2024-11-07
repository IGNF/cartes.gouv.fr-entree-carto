<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { Legends } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  legendsOptions: Object
});

import { mainMap } from "@/composables/keys"
const map = inject(mainMap);
const legends = ref(new Legends(props.legendsOptions));

onMounted(() => {
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
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>