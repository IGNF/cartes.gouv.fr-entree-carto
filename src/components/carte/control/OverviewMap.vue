<script setup lang="js">

import OverviewMap from 'ol/control/OverviewMap'

const props = defineProps({
  visibility: Boolean,
  overviewMapOptions: Object
})

const map = inject('map')
const overviewMap = ref(new OverviewMap(props.overviewMapOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(overviewMap.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(overviewMap.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(overviewMap.value)
  }
})

</script>

<template></template>

<style>
  #map .ol-custom-overviewmap {
    bottom: 30px;
    left: auto;
    right: 20px;
    top: auto;
  }
</style>
