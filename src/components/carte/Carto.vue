<script setup lang="js">
import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Control from '@/components/carte/Control.vue'
import LayerManager from '@/components/carte/Layer/LayerManager.vue'
import LeftMenu from '@/components/menu/LeftMenu.vue'
import RightMenu from '@/components/menu/RightMenu.vue'

import { useControls } from '@/composables/controls'
import { useMapStore } from "@/stores/mapStore"
import { useDataStore } from "@/stores/dataStore"

const dataStore = useDataStore()
const mapStore = useMapStore()
const catalogueProps = { layersConf : toRaw(dataStore.layers) };

const availableControls = Object.values(useControls);
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
}


const mapWidth=70
const menuWidth = 100 - mapWidth;
</script>

<template>

  
  <div id="map-container">
    <!-- FIXME les menus ne font pas partis de la carte !? -->


    <!-- <MenuCatalogue
      :layers="layersConf"
      @add-layer="addLayer"/>
    <MenuControl
      v-model="selectedControls"/>
     -->
    <LeftMenu
    :width="menuWidth"
    :catalogue-props="catalogueProps"
    v-model="selectedControls"
     @catalogue-event="addLayer"
    />
    <RightMenu
    :width="menuWidth"
    :catalogue-props="catalogueProps"
    v-model="selectedControls"
     @catalogue-event="addLayer"
    />
    <Map
    :width="mapWidth">
      <View
        :center="mapStore.center"
        :zoom="mapStore.zoom"/>
      <Control
        v-if="selectedControls"
        :control-options="selectedControls"/>
      <!-- FIXME c'est un composant pour l'exemple
      donc provisoire ! -->
      <LayerManager
        :layers-list="layersList"/>
    </Map>

  </div>
  
</template>

<style scoped>
  #map-container{
    margin-left: 0;
    width: inherit;
    height: 70vh;
  }
</style>