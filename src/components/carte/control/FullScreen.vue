<script setup lang="js">
import { GeoportalFullScreen } from 'geopf-extensions-openlayers'

// FIXME
// ajouter un ID sur le bouton pour y ajouter un tracker Eulerian

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  fullscreenOptions: Object
})

import { mainMap } from "@/composables/keys"
const map = inject(mainMap)
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
