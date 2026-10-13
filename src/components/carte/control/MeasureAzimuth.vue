<script setup lang="js">
import { mainMap } from '@/composables/keys';
import { MeasureAzimuth } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  disabled: Boolean,
  measureAzimuthOptions: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['ready']);


const map = inject(props.mapId)
const measureAzimuth = ref(new MeasureAzimuth(props.measureAzimuthOptions))

onMounted(() => {
  emit('ready');
  if (props.visibility) {
    map.addControl(measureAzimuth.value);
    if (props.disabled) {
      measureAzimuth.value.getContainer().firstChild.setAttribute("disabled", "true");
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureAzimuth.value);
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
