<script setup lang="js">

import Zoom from 'ol/control/Zoom'

const props = defineProps({
  visibility: Boolean,
  zoomOptions: Object
})

const map = inject('map')
const zoom = ref(new Zoom(props.zoomOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(zoom.value)
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
</script>

<template></template>

<style scoped>
  /* TODO style DSFR */
</style>