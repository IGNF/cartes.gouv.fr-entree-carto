<script setup lang="js">

import { useMatchMedia } from '@/composables/matchMedia';
import OverviewMap from 'ol/control/OverviewMap'

const props = defineProps({
  visibility: Boolean,
  overviewMapOptions: Object
})

const map = inject('map')
const overviewMap = ref(new OverviewMap(props.overviewMapOptions))

const isSmallScreen =  useMatchMedia("SM")

watch(isSmallScreen, () => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(overviewMap.value)
  }
  else {
    map.removeControl(overviewMap.value)
  }
})  

onMounted(() => {
  if (props.visibility && !isSmallScreen.value) {
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
