<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"

import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geopf-extensions-openlayers'

import { 
  createVectorLayer, 
  createServiceLayer,
  createMapBoxLayer 
} from '@/features/layer.js';

const props = defineProps({
  layerOptions: Object,
  mapId : String
})

const log = useLogger()
log.debug(props.layerOptions);

const store = useDataStore()

const map = inject(props.mapId)
var layer = null

onMounted(() => {
  // les options sont obligatoires pour configurer une couche
  if (!props.layerOptions || Object.keys(props.layerOptions).length === 0) {
    return;
  }
  
  // INFO
  // ajout du traitement des couches issues du catalogue
  // liste des informations utiles pour recuperer tous les paramètres de la couche
  // Array(Object) : [{name, service}]
  if (props.layerOptions.name && props.layerOptions.service) {
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
        options.declutter = true;
        // INFO le style par defaut est utilisé !
        layer = new GeoportalMapBox({
          layer : name,
          configuration : value,
          apiKey : "ign_scan_ws",
        }, options);
        break;
      default:
    }
  }
  
  // INFO
  // ajout du traitement des couches de type "vecteur" pour les 
  // données personnelles
  // liste des informations utiles pour recuperer tous les paramètres de la couche
  // Array(Object) : [{url, format, type, opacity, visibility, ...}]
  if (props.layerOptions.url && props.layerOptions.format) {
    var isAsync = false;
    const type = props.layerOptions.type.toLowerCase();
    const format = props.layerOptions.format.toLowerCase();
    log.debug("layer to add", type);

    // liste des types de couches à traiter
    switch (type) {
      case "service":
        isAsync = true;
        var kind = props.layerOptions.kind.toLowerCase();
        if (kind === "mapbox") {
          createMapBoxLayer(props.layerOptions)
          .then((l) => {
            layer = l;
            map.addLayer(layer);
          })
          .catch((e) => {
            throw e;
          });
        } else if (kind === "wmts" || kind === "wms") {
          createServiceLayer(props.layerOptions)
          .then((l) => {
            layer = l;
            map.addLayer(layer);
          })
          .catch((e) => {
            throw e;
          });
        } else {
          throw new Error("Le service est inconnu !");
        }
        break;
      case "carte":
        throw "Not yet implemented !";
        break;
      case "compute":
        throw "Not yet implemented !";
        break;
      case "import":
        // url de partage contient toujours un contenu
        // - soit pour un import ou croquis passant par l'outil d'édition
        // - soit pour un fichier de style mapbox par l'outil d'édition
        if (format === "mapbox") {
          isAsync = true;
          createMapBoxLayer(props.layerOptions)
          .then((l) => {
            layer = l;
            map.addLayer(layer);
          })
          .catch((e) => {
            throw e;
          });
        } else {
          layer = createVectorLayer(props.layerOptions);  
        }
        break;
      case "drawing":
        // url de partage contient toujours un contenu du croquis
        layer = createVectorLayer(props.layerOptions);
        break;
      default:
        break;
    }
  }

  // ajout de la couche
  if (layer && !isAsync) {
    map.addLayer(layer);
  }
})

onUnmounted(() => {
  if (map && layer) {
    map.removeLayer(layer)
  }
})

</script>

<template>
  <div>
    <slot />
  </div>
</template>
