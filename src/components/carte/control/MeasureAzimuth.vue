<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { MeasureAzimuth } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  measureAzimuthOptions: Object
})

const emit = defineEmits(['ready']);


const map = inject(props.mapId)
const measureAzimuth = ref(new MeasureAzimuth(props.measureAzimuthOptions))

onMounted(() => {
  emit('ready');
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
