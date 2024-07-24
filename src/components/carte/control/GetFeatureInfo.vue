<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'

import {
  GetFeatureInfo
} from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  getFeatureInfoOptions: Object
})

const map = inject('map')
const getFeatureInfo = reactive(new GetFeatureInfo(props.getFeatureInfoOptions))
onMounted(() => {
  if (props.visibility) {
    map.addControl(getFeatureInfo)
  }
})

onUnmounted(() => {
  map.removeControl(getFeatureInfo)
})

</script>

<template>
  <div></div>
</template>

<style>
</style>
