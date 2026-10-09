<script setup lang="js">
import { mainMap } from '@/composables/keys';
import { MeasureLength } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  disabled: Boolean,
  measureLengthOptions: { type: Object, default: () => ({}) }
})


const map = inject(props.mapId);

const emit = defineEmits(['ready']);
const measureLength = ref(new MeasureLength(props.measureLengthOptions));

onMounted(() => {
  emit('ready');
  if (props.visibility) {
    map.addControl(measureLength.value);
    if (props.disabled) {
      measureLength.value.getContainer().firstChild.setAttribute("disabled", "true");
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureLength.value);
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
