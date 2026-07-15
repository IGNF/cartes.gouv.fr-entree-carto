<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { MeasureArea } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  measureAreaOptions: Object
})


const map = inject(props.mapId);

const emit = defineEmits(['ready']);
const measureArea = ref(new MeasureArea(props.measureAreaOptions));

onMounted(() => {
  emit('ready');
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
