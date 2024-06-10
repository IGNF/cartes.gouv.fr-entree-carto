<script setup lang="ts">
import Carto from '@/components/carte/Carto.vue'
import LeftMenu from '@/components/menu/LeftMenu.vue'
import RightMenu from '@/components/menu/RightMenu.vue'

import { useLogger } from 'vue-logger-plugin'
import { useControls } from '@/composables/controls'
import { useDataStore } from "@/stores/dataStore"

const log = useLogger()
const dataStore = useDataStore()
const catalogueProps = { layersConf : toRaw(dataStore.getLayers()) };

const availableControls = Object.keys(useControls).map(key => {
  if (useControls[key].active) {
    return key;
  }
});
const selectedControls = ref(availableControls);

const newLayer = ref("");
const layersList = computed(() => {
  let list = listBeforeUpdate.value
  if (newLayer.value)
    list.push(newLayer.value)
  list = list.map(layername => getLayerConfFromTitle(layername))
  return list;
})
// FIXME c'est pour l'exemple, on utilise cette couche par defaut !?
// mais, les settings par defaut devraient être fournis par le mapStore !
const listBeforeUpdate = ref(["Plan IGN v2"])

// FIXME c'est une methode du dataStore !
function getLayerConfFromTitle(layername) {
  return Object.values(catalogueProps.layersConf).filter((layer) => {
    if (layername && layer.title == layername) {
      return layer
    }
  })[0]
}

function addLayer(layername) {
  newLayer.value = layername;
  listBeforeUpdate.value.concat(layername)
  log.debug(listBeforeUpdate);
}

</script>

<template>
<div id="map-and-tools-container">
  <LeftMenu
    :catalogue-props="catalogueProps"
    v-model="selectedControls"
     @catalogue-event="addLayer"
    />
  <Carto
    :layers-list="layersList"
    :selected-controls="selectedControls"/>
  <RightMenu
    :catalogue-props="catalogueProps"
    v-model="selectedControls"
     @catalogue-event="addLayer"
    />
</div>

</template>

<style scoped>
  #map-and-tools-container{
    margin-left: 0;
    width: inherit;
    height: 70vh;
    display: flex;
  }
</style>