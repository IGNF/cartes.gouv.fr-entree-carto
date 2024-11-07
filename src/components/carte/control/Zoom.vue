<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import {
  GeoportalZoom
} from 'geopf-extensions-openlayers'

// FIXME
// tracker Eulerian !?

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  zoomOptions: Object
})

const log = useLogger()

import { mainMap } from "@/composables/keys"
const map = inject(mainMap)
const zoom = ref(new GeoportalZoom(props.zoomOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(zoom.value)
    zoom.value.on('zoom:in', onClickZoomIn)
    zoom.value.on('zoom:out', onClickZoomOut)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(zoom.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(zoom.value)
  }
})

function onClickZoomIn (e) {
  log.debug(e)
}

function onClickZoomOut (e) {
  log.debug(e)
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
