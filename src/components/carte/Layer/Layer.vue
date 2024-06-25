<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"

// FIXME c'est pour l'exemple car les couches sont gérées par les extensions !
// cf. LayerManager
import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geoportal-extensions-openlayers'

const props = defineProps({
  layerOptions: Object
})

const log = useLogger()
const store = useDataStore()

const map = inject('map')
const layer = ref(null)

onMounted(() => {
  var value = store.getLayerByName(props.layerOptions.name, props.layerOptions.service);
  var params = store.getLayerParamsByName(props.layerOptions.name, props.layerOptions.service);
  value.params = params; // fusion
  log.debug("layer to add", value);

  var service = props.layerOptions.service;
  var name = props.layerOptions.name;
  switch (service) {
    case "WMS":
      layer.value = new GeoportalWMS({
        layer : name,
        configuration : value
      });
      break;
    case "WMTS":
      layer.value = new GeoportalWMTS({
        layer : name,
        configuration : value
      });
      break;
    case "TMS":
      // INFO le style par defaut est utilisé !
      layer.value = new GeoportalMapBox({
        layer : name,
        configuration : value
      });
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
