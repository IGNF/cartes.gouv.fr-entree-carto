<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { MeasureLength } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  measureLengthOptions: Object
})

const map = inject('map');
const measureLength = ref(new MeasureLength(props.measureLengthOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(measureLength.value);
    if (props.analytic) {
      var el = measureLength.value.element.querySelector("button[id^=GPshowMeasureLengthPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureLength.value);
    if (props.analytic) {
      var el = measureLength.value.element.querySelector("button[id^=GPshowMeasureLengthPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(measureLength.value);
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
