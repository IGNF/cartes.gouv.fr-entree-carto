<script setup lang="js">
import { mainMap } from '@/composables/keys';
import {
  MousePosition
} from 'geopf-extensions-openlayers'

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  mousePositionOptions: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['ready']);

const map = inject(props.mapId)
const mousePosition = ref(new MousePosition(props.mousePositionOptions))

onMounted(() => {
  emit('ready');
  if (props.visibility) {
    map.addControl(mousePosition.value);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(mousePosition.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(mousePosition.value);
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
