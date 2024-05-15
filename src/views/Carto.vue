<script setup lang="js">
// FIXME la view Carto n'est plus une view appelée dans le router,
// ne devrait on pas la basculer en composant ?
import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Control from '@/components/carte/Control.vue'
import LayerManager from '@/components/carte/Layer/LayerManager.vue'
import MenuCatalogue from '@/components/carte/MenuCatalogue.vue'

import { useControls } from '@/composables/controls'
import { useMapStore } from "@/stores/mapStore"

// FIXME on doit utiliser le dataStore !
// cf. ex dans le composant StoreDataLoading
const techUrl = import.meta.env.VITE_GPF_CONF_TECH_URL || "data/layers.json";
const editoUrl = import.meta.env.VITE_GPF_CONF_EDITO_URL || "data/edito.json";
const techRes = await fetch(techUrl);
const editoRes = await fetch(editoUrl);
const tech = await techRes.json();
const edito = await editoRes.json();

// FIXME c'est une methode du dataStore !
const layersConf = Object.values(tech.layers).map((layer) => {
  let key = Object.keys(layer)
  let ret = layer
  if (key in edito.layers)  {
    return Object.assign(ret, edito.layers[key]); // merge

  }  
  return layer;
})

const store = useMapStore()

// FIXME c'est pour l'exemple, on utilise le zoom / centre par defaut !?
// mais, les settings par defaut devraient être fournis par le mapStore !
store.setZoom(12)
store.setCenter([283734.248995, 5655117.100650])

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
    <!-- FIXME les menus ne font pas partis de la carte !? -->
    <MenuCatalogue
      :layers="layersConf"
      @add-layer="addLayer"/>
    <MenuControl
      v-model="selectedControls"/>
    
    <Map>
      <View
        :center="store.getCenter"
        :zoom="store.getZoom"/>
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