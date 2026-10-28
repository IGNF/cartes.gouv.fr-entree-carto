<script setup lang="js">
import { mainMap } from '@/composables/keys';
import { MeasureArea } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  disabled: Boolean,
  measureAreaOptions: { type: Object, default: () => ({}) }
})


const map = inject(props.mapId);

const emit = defineEmits(['ready']);
const measureArea = ref(new MeasureArea(props.measureAreaOptions));

onMounted(() => {
  emit('ready');
  if (props.visibility) {
    map.addControl(measureArea.value);
    if (props.disabled) {
      measureArea.value.getContainer().firstChild.setAttribute("disabled", "true");
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureArea.value);
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
