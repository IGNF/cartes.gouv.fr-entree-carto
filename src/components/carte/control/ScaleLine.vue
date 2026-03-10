<script setup lang="js">

import ScaleLine from 'ol/control/ScaleLine'

// FIXME
// - utiliser le widget GeoportalScaleLine !
// - tracker Eulerian ?

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  scaleLineOptions: Object
})


const map = inject(props.mapId)
const scaleLine = ref(new ScaleLine(props.scaleLineOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(scaleLine.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(scaleLine.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(scaleLine.value)
  }
})
</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.ol-scale-line {
  z-index: auto;
  left: auto;
  right: $widget-panel-x;
  background: var(--background-default-grey);
}
// couleur en mode sombre
html[data-fr-theme="dark"] .ol-scale-line-inner {
  color: var(--text-action-high-blue-france);
  border-color: var(--text-action-high-blue-france);
}
</style>
