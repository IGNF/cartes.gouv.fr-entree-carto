<script setup lang="js">

import ScaleLine from 'ol/control/ScaleLine'

// TODO
// utiliser le widget GeoportalScaleLine !

const props = defineProps({
  visibility: Boolean,
  scaleLineOptions: Object
})

const map = inject('map')
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
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
  .ol-scale-line {
    left: 50px;
  }
</style>