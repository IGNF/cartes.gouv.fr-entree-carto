<script setup lang="js">
import { GeoportalFullScreen } from 'geopf-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  fullscreenOptions: Object
})

const map = inject('map')
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
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
