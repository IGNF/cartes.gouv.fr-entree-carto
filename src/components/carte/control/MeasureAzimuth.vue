<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { MeasureAzimuth } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  measureAzimuthOptions: Object
})

import { mainMap } from "@/composables/keys"
const map = inject(mainMap)
const measureAzimuth = ref(new MeasureAzimuth(props.measureAzimuthOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(measureAzimuth.value);
    if (props.analytic) {
      var el = measureAzimuth.value.element.querySelector("button[id^=GPshowMeasureAzimuthPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureAzimuth.value);
    if (props.analytic) {
      var el = measureAzimuth.value.element.querySelector("button[id^=GPshowMeasureAzimuthPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(measureAzimuth.value);
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
