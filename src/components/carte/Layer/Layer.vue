<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"

import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geopf-extensions-openlayers'

const props = defineProps({
  layerOptions: Object
})

// INFO
// liste des informations utiles pour recuperer tous les paramètres de la couche
// Array(Object) : [{name, service}]
const log = useLogger()
log.debug(props.layerOptions);

const store = useDataStore()

const map = inject('map')
const layer = ref(null)

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
    gray : props.layerOptions.gray
  };
  // ajout des options de preload par defaut
  var preload = {
    preload : Infinity,
    cacheSize : 1024
  };
  switch (service) {
    case "WMS":
      layer.value = new GeoportalWMS({
        layer : name,
        configuration : value,
        olParams : Object.assign(options, preload)
      });
      break;
    case "WMTS":
      layer.value = new GeoportalWMTS({
        layer : name,
        configuration : value,
        olParams : Object.assign(options, preload)
      });
      break;
    case "TMS":
      // INFO le style par defaut est utilisé !
      layer.value = new GeoportalMapBox({
        layer : name,
        configuration : value
      }, options);
      break;
    default:
  }
  if (layer.value) {
    map.addLayer(layer.value);
  }
})

onUnmounted(() => {
  map.removeLayer(layer.value)
})

</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>
