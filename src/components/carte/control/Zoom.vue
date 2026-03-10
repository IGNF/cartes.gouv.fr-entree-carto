<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import {
  GeoportalZoom
} from 'geopf-extensions-openlayers'

// FIXME
// tracker Eulerian !?

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  zoomOptions: Object
})

const log = useLogger()

const map = inject(props.mapId)
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
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

// zoom: 2 boutons pour un seul controle
.ol-custom-zoom {
  height: $widget-btn-size * 2;
}
.ol-custom-zoom-in,
.ol-custom-zoom-out {
  height: 50%;

  // supprime tooltip
  &::before {
    content: none !important;
  }
}
</style>
