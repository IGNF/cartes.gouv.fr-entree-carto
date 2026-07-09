<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { mainMap } from '@/composables/keys';
import { MeasureAzimuth } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  analytic: Boolean,
  measureAzimuthOptions: { type: Object, default: () => ({}) }
})


const map = inject(props.mapId)
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
  <div />
</template>
