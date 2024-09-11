<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { MeasureArea } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  measureAreaOptions: Object
})

const map = inject('map');
const measureArea = ref(new MeasureArea(props.measureAreaOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(measureArea.value);
    if (props.analytic) {
      var el = measureArea.value.element.querySelector("button[id^=GPshowMeasureAreaPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureArea.value);
    if (props.analytic) {
      var el = measureArea.value.element.querySelector("button[id^=GPshowMeasureAreaPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(measureArea.value);
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
