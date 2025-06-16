<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";

import { 
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geopf-extensions-openlayers';

import { 
  createVectorLayer, 
  createServiceLayer,
  createMapBoxLayer,
  createComputeLayer
} from '@/features/layer.js';


const props = defineProps({
  layerOptions: Object,
  mapId : String
});

const log = useLogger();
log.debug(props.layerOptions);

const dataStore = useDataStore();
const mapStore = useMapStore();

const map = inject(props.mapId);
var layer = null;

onMounted(() => {
  // les options sont obligatoires pour configurer une couche
  if (!props.layerOptions || Object.keys(props.layerOptions).length === 0) {
    return;
  }
  
  const service = props.layerOptions.service;
  const name = props.layerOptions.name;
  const position = props.layerOptions.position;

  // INFO
  // ajout du traitement des couches issues du catalogue
  // liste des informations utiles pour recuperer tous les paramètres de la couche
  // Array(Object) : [{name, service}]
  if (name && service) {
    var value  = dataStore.getLayerByName(props.layerOptions.name, props.layerOptions.service);
    var params = dataStore.getLayerParamsByName(props.layerOptions.name, props.layerOptions.service);
    value.params = params; // fusion
    
    var options = {
      position : props.layerOptions.position,
      visible : props.layerOptions.visible,
      opacity : props.layerOptions.opacity,
      grayscale : props.layerOptions.grayscale,
      sourceParams : {crossOrigin : 'anonymous'}
    };
    // ajout des options de preload par defaut
    var preload = {
      preload : Infinity,
      cacheSize : 1024
    };

    log.debug("layer to add (catalog)", name, service, options, value);
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
        options.styleName = props.layerOptions.style || "default";
        layer = new GeoportalMapBox({
          layer : name,
          style : props.layerOptions.style,
          configuration : value,
          apiKey : "ign_scan_ws",
        }, options);
        break;
      default:
    }

    if (layer) {
      log.debug(name, "| position (props - zindex)", position, layer.getZIndex());
      if (position !== layer.getZIndex()) {
        if (position === -1) {
            log.debug(name, "| position auto");
          } else {
            log.debug(name, "| change position", position);
            layer.setZIndex(Number(position));
          }
      }
      map.addLayer(layer);
    }
  }
  
  const url = props.layerOptions.url;
  const format = props.layerOptions.format;

  // INFO
  // ajout du traitement des couches de type "vecteur" pour les 
  // données personnelles
  // liste des informations utiles pour recuperer tous les paramètres de la couche
  // Array(Object) : [{url, format, type, opacity, visibility, ...}]
  if (url && format) {
    var promise = null;
    const type = props.layerOptions.type.toLowerCase();

    log.debug("layer to add (bookmark)", name, type, format);
    // liste des types de couches à traiter
    switch (type) {
      case "service":
        var kind = props.layerOptions.kind.toLowerCase();
        if (kind === "mapbox") {
          promise = createMapBoxLayer(props.layerOptions);
        } else if (kind === "wmts" || kind === "wms") {
          promise = createServiceLayer(props.layerOptions);
        } else {
          throw new Error("Le service est inconnu !");
        }
        break;
      case "carte":
        throw "Not yet implemented !";
        break;
      case "compute":
        promise = createComputeLayer(props.layerOptions);  
        break;
      case "import":
        // url de partage contient toujours un contenu
        // - soit pour un import ou croquis passant par l'outil d'édition
        // - soit pour un fichier de style mapbox par l'outil d'édition
        if (format.toLowerCase() === "mapbox") {
          promise = createMapBoxLayer(props.layerOptions);
        } else {
          promise = createVectorLayer(props.layerOptions);  
        }
        break;
      case "drawing":
        // url de partage contient toujours un contenu du croquis
        promise = createVectorLayer(props.layerOptions);
        break;
      default:
        break;
    }

    // ajout de la couche
    if (promise) {
      promise
      .then((l) => {
        map.addLayer(l);
        return l;
      })
      .then((l) => {
        log.debug(name, "| position (props - zindex)", position, l.getZIndex());
        if (position !== l.getZIndex()) {
          if (position === -1) {
            log.debug(name, "| position auto");
          } else {
            log.debug(name, "| change position", position);
            l.setZIndex(Number(position));
          }
        }
        return l;
      })
      .then((l) => {
        // sauvegarde de la couche
        layer = l;
      })
      .then(() => {
        // zoom sur la couche
        // sauf si la couche vient du permalien !
        if (mapStore.isPermalink) {
          return;
        }
        var source = layer.getSource();
        if (map.getView() && map.getSize()) {
          var sourceExtent = null;
          if (source && source.getExtent) {
            sourceExtent = source.getExtent();
          } else {
            if (source && source.getTileGrid) {
              // INFO : pour les couches mapbox
              sourceExtent = source.getTileGrid().getExtent();
            }
          }
          if (sourceExtent && sourceExtent[0] !== Infinity) {
            map.getView().fit(sourceExtent, map.getSize());
          } else {
            layer.once('change', () => {
              if (layer.getSource().getExtent()) {
                map.getView().fit(layer.getSource().getExtent(), map.getSize());
              }
            });
          }
        }
      })
      .catch((e) => {
        throw e;
      });
    }
  }
})

/**
 * @fixme un update sur un import ou drawing supprime le layer !?
 */
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
