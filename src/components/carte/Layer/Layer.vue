<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"

import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geopf-extensions-openlayers'

const props = defineProps({
  layerOptions: Object,
  mapId : String
})

// INFO
// liste des informations utiles pour recuperer tous les paramètres de la couche
// Array(Object) : [{name, service}]
const log = useLogger()
log.debug(props.layerOptions);

const store = useDataStore()

const map = inject(props.mapId)
var layer = null

onMounted(() => {
  var value  = store.getLayerByName(props.layerOptions.name, props.layerOptions.service);
  var params = store.getLayerParamsByName(props.layerOptions.name, props.layerOptions.service);
  value.params = params; // fusion
  log.debug("layer to add", value);

  var service = props.layerOptions.service;
  var name = props.layerOptions.name;
  var options = {
    visible : props.layerOptions.visible,
    opacity : props.layerOptions.opacity,
    gray : props.layerOptions.gray,
    sourceParams : {crossOrigin : 'anonymous'}
  };
  // ajout des options de preload par defaut
  var preload = {
    preload : Infinity,
    cacheSize : 1024
  };
  switch (service) {
    case "WMS":
      layer = new GeoportalWMS({
        layer : name,
        configuration : value,
        apiKey : "ign_scan_ws",
        olParams : Object.assign(options, preload)
      });
      break;
    case "WMTS":
      layer = new GeoportalWMTS({
        layer : name,
        configuration : value,
        apiKey : "ign_scan_ws",
        olParams : Object.assign(options, preload)
      });
      break;
    case "TMS":
      // INFO le style par defaut est utilisé !
      layer = new GeoportalMapBox({
        layer : name,
        configuration : value,
        apiKey : "ign_scan_ws",
      }, options);
      break;
    default:
  }
  if (layer) {
    map.addLayer(layer);
  }
})

onUnmounted(() => {
  map.removeLayer(layer)
})

</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>
