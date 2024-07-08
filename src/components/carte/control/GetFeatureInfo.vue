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

const layerStore = useLayerStore();
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
      let l = Object.values(toRaw(map.getLayers().getArray())
                        .map((layer) => {
                          return {
                            obj : toRaw(layer),
                            event: 'singleClick',
                            infoFormat : "text/html"
                          }
                        }));
      getFeatureInfo.setLayers(l)
    },
    { deep: false }
  )

</script>

<template>
  <div></div>
</template>

<style>
</style>
