<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"
import { useMapStore } from '@/stores/mapStore';
import { useLayerStore } from '@/stores/layerStore';

import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geoportal-extensions-openlayers'

const props = defineProps({
  layerOptions: Object
})

// INFO
// liste des informations utiles pour recuperer tous les paramètres de la couche
// Array(Object) : [{name, service}]
const log = useLogger()
log.debug(props.layerOptions);

const dataStore = useDataStore()
const layerStore = useLayerStore()

const map = inject('map')
const layer = ref(null)

onMounted(() => {
  var value  = dataStore.getLayerByName(props.layerOptions.name, props.layerOptions.service);
  var params = dataStore.getLayerParamsByName(props.layerOptions.name, props.layerOptions.service);
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
    layerStore.addOlLayer(layer.value)
    map.addLayer(layer.value);
  }
})

onUnmounted(() => {
  layerStore.removeOlLayer(layer.value)
  map.removeLayer(layer.value.ol_uid)
})

</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>
