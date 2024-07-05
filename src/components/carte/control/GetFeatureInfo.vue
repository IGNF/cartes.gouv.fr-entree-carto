<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useLayerStore } from "@/stores/layerStore"
import { useMapStore } from "@/stores/mapStore"
import { storeToRefs } from 'pinia'

import {
  GetFeatureInfo
} from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  getFeatureInfoOptions: Object
})

const log = useLogger()
const layerStore = useLayerStore();
const mapStore = useMapStore();
const map = inject('map')
const getFeatureInfo = reactive(new GetFeatureInfo(props.getFeatureInfoOptions))
const { olLayers } = storeToRefs(layerStore)
onMounted(() => {
  if (props.visibility) {
    map.addControl(getFeatureInfo)
  }
})

onUnmounted(() => {
  map.removeControl(getFeatureInfo)
})

watch(olLayers.value, (oldval, newval) => {   
      console.log(toRaw(newval))
      let l = Object.values(toRaw(map.getLayers().getArray()).map((ls) => toRaw(ls)));
      console.log(l)

      // getFeatureInfo.setLayers(toRaw(newval).map((l) => l.values_))
      getFeatureInfo.setLayers(l)
      console.log(mapStore.getMap().getLayers().getArray()[0].getZIndex())
      getFeatureInfo.setLayers(mapStore.getMap().getLayers().getArray())
    },
    { deep: false }
  )

</script>

<template>
  <div></div>
</template>

<style>
</style>
