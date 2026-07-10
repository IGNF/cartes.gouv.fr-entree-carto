<script setup lang="js">
import { GeoportalFullScreen } from 'geopf-extensions-openlayers'

// FIXME
// ajouter un ID sur le bouton pour y ajouter un tracker Eulerian

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  fullscreenOptions: Object
})


const map = inject(props.mapId)
const fullscreen = ref(new GeoportalFullScreen(props.fullscreenOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(fullscreen.value)
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(fullscreen.value)
  }
  else {
    map.removeControl(fullscreen.value)
  }
})
</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.ol-custom-full-screen .gpf-btn-icon {
  width: $widget-btn-size;
  height: $widget-btn-size;
}
</style>
