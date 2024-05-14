<script setup lang="js">
import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Control from '@/components/carte/Control.vue'
import LayerManager from '@/components/carte/Layer/LayerManager.vue'
import MenuCatalogue from '@/components/carte/MenuCatalogue.vue'

import { useControls } from '@/composables/controls'
import { useMapStore } from "@/stores/mapStore"

const techUrl = import.meta.env.VITE_GPF_CONF_TECH_URL || "data/layers.json";
const editoUrl = import.meta.env.VITE_GPF_CONF_EDITO_URL || "data/edito.json";
const techRes = await fetch(techUrl);
const editoRes = await fetch(editoUrl);
const tech = await techRes.json();
const edito = await editoRes.json();
/**
 *  Layers conf contient l'ensemble des propriétés
 * techniques et éditoriales des couches disponibles
 */
const layersConf = Object.values(tech.layers).map((layer) => {
  let key = Object.keys(layer)
  let ret = layer
  if (key in edito.layers)  {
    return Object.assign(ret, edito.layers[key]); // merge

  }  
  return layer;
})
const store = useMapStore()

store.setZoom(12)
store.setCenter([283734.248995, 5655117.100650])

const selectedControls = ref(availableControls);

const newLayer = ref("");
const layersList = computed(() => {
  let list = listBeforeUpdate.value
  if (newLayer.value)
    list.push(newLayer.value)
  list = list.map(layername => getLayerConfFromTitle(layername))
  return list;
}) 
const listBeforeUpdate = ref(["Plan IGN v2"])

function getLayerConfFromTitle(layername) {
  return Object.values(layersConf).filter((layer) => {
    if (layername && layer.title == layername) {
      return layer
    }
  })[0]
}

function addLayer(layername) {
  newLayer.value = layername;
  listBeforeUpdate.value.concat(layername)
}

</script>

<template>

<div id="map-container">
    <MenuCatalogue
    :layers="layersConf"
    @add-layer="addLayer"/>
  <MenuControl
    v-model="selectedControls"
  />
  <Map>

    <View
      :center="store.getCenter"
      :zoom="store.getZoom"
    />
    <Control
      v-if="selectedControls"
      :control-options="selectedControls"
    />
    <LayerManager
      :layers-list="layersList"
    />
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