<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { mainMap } from '@/composables/keys';
import { MeasureLength } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  analytic: Boolean,
  measureLengthOptions: { type: Object, default: () => ({}) }
})


const map = inject(props.mapId);

const emit = defineEmits(['ready']);
const measureLength = ref(new MeasureLength(props.measureLengthOptions));

onMounted(() => {
  emit('ready');
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
