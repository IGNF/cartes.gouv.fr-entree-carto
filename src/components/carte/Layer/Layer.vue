<script setup lang="js">

import { inject, onMounted, onUnmounted } from 'vue';
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

// lib notification
import { push } from 'notivue'
import t from '@/features/translation';

const props = defineProps({
  layerOptions: {
    type: Object,
    default: () => ({})
  },
  mapId: {
    type: String,
    default: ''
  }
});

const log = useLogger();
log.debug(props.layerOptions);

const dataStore = useDataStore();
const mapStore = useMapStore();

const emit = defineEmits(['mounted', 'unmounted']);

const map = inject(props.mapId);
var layer = null;

onMounted(() => {
  // les options sont obligatoires pour configurer une couche
  if (!props.layerOptions || Object.keys(props.layerOptions).length === 0) {
    return;
  }

  const enqueueOnMap = async () => {
    const service = props.layerOptions.service;
    const name = props.layerOptions.name;
    const position = props.layerOptions.position;
    const url = props.layerOptions.url;
    const format = props.layerOptions.format;

    // INFO
    // ajout du traitement des couches issues du catalogue
    if (name && service) {
      var value  = dataStore.getLayerByName(props.layerOptions.name, props.layerOptions.service);
      var params = dataStore.getLayerParamsByName(props.layerOptions.name, props.layerOptions.service);
      value.params = params; // fusion

      var options = {
        position : props.layerOptions.position,
        visible : props.layerOptions.visible,
        opacity : props.layerOptions.opacity,
        grayscale : props.layerOptions.grayscale,
        sourceParams : {crossOrigin : 'anonymous'},
        permalink : props.layerOptions.permalink || false
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
            apiKey : "entree-carto",
            olParams : Object.assign(options, preload)
          });
          break;
        case "WMTS":
          layer = new GeoportalWMTS({
            layer : name,
            configuration : value,
            apiKey : "entree-carto",
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
            apiKey : "entree-carto",
          }, options);
          break;
        default:
      }

      if (layer) {
        log.debug(name, "| position (props - zindex)", position, layer.getZIndex());
        if (position !== layer.getZIndex()) {
          if (Number(position) === -1) {
            log.debug(name, "| position auto");
          } else {
            log.debug(name, "| change position", position);
            layer.setZIndex(Number(position));
          }
        }
        map.addLayer(layer);
        emit('mounted');
      } else {
        log.warn("La couche n'est pas reconnue !");
        push.warning({
          title: t.notification.title,
          message: t.notification.unknown_add_layer(name, service)
        });
      }
      return;
    }

    // INFO
    // ajout du traitement des couches de type "vecteur" pour les données personnelles
    if (url && format) {
      var promise = null;
      const type = props.layerOptions.type.toLowerCase();

      log.debug("layer to add (bookmark)", name, type, format);
      var opts = props.layerOptions;
      // HACK on ajoute un timestamp à l'url cache-busting
      opts.url = `${opts.url}?_=${Date.now()}`;
      switch (type) {
        case "wms":
        case "wmts":
        case "service":
          var kind = props.layerOptions.kind ? props.layerOptions.kind.toLowerCase() : null;
          if (kind === "mapbox" || type === "mapbox") {
            promise = createMapBoxLayer({
              ...opts,
              type: "service",
              kind: "mapbox"
            });
          } else if (kind === "wms" || type === "wms") {
            promise = createServiceLayer({
              ...opts,
              type: "service",
              kind: "wms"
            });
          } else if (kind === "wmts" || type === "wmts") {
            promise = createServiceLayer({
              ...opts,
              type: "service",
              kind: "wmts"
            });
          } else {
            throw new Error("Le service est inconnu !");
          }
          break;
        case "carte":
          throw new Error("Not yet implemented !");
        case "compute":
          promise = createComputeLayer(props.layerOptions);
          break;
        case "url-mapbox":
        case "mapbox":
        case "url-kml":
        case "kml":
        case "url-gpx":
        case "gpx":
        case "url-geojson":
        case "geojson":
        case "import":
          // url de partage contient toujours un contenu
          // - soit pour un import ou croquis passant par l'outil d'édition
          // - soit pour un fichier de style mapbox par l'outil d'édition
          if (format.toLowerCase() === "mapbox" || type === "url-mapbox" || type === "mapbox") {
            promise = createMapBoxLayer(props.layerOptions);
          } else {
            promise = createVectorLayer({
              ...opts,
              type: "import",
              format: format || (type && type.startsWith("url-") ? type.slice(4) : type)
            });
          }
          break;
        case "drawing":
          promise = createVectorLayer(props.layerOptions);
          break;
        default:
          break;
      }

      if (!promise) {
        return;
      }

      layer = await promise;
      log.debug(name, "| position (props - zindex)", position, layer.getZIndex());
      if (position !== layer.getZIndex()) {
        if (Number(position) === -1) {
          log.debug(name, "| position auto");
        } else {
          log.debug(name, "| change position", position);
          layer.setZIndex(Number(position));
        }
      }

      map.addLayer(layer);
      emit('mounted');
      // zoom sur la couche sauf si la couche vient du permalien
      if (mapStore.isPermalink()) {
        return;
      }
      // INFO : 
      // on desactive le zoom to extent...
      // var source = layer.getSource();
      // if (map.getView() && map.getSize()) {
      //   var sourceExtent = null;
      //   if (source && source.getExtent) {
      //     sourceExtent = source.getExtent();
      //   } else if (source && source.getTileGrid) {
      //     // INFO : pour les couches mapbox
      //     sourceExtent = source.getTileGrid().getExtent();
      //   }
      //   if (sourceExtent && sourceExtent[0] !== Infinity) {
      //     map.getView().fit(sourceExtent,  { size : map.getSize() });
      //   } else {
      //     layer.once('change', () => {
      //       if (layer.getSource().getExtent()) {
      //         map.getView().fit(layer.getSource().getExtent(),  { size : map.getSize() });
      //       }
      //     });
      //   }
      // }  
    }
  };

  const queueKey = "__layerAddQueue";
  const currentQueue = map[queueKey] || Promise.resolve();
  map[queueKey] = currentQueue
    .then(() => enqueueOnMap()) 
    .catch((e) => {
      const name = props.layerOptions.name || props.layerOptions.id || "inconnue";
      log.warn("Exception sur la couche " + name + " !");
      console.warn(e);
      push.warning({
        title: t.notification.title,
        message: t.notification.exception_add_layer(name, e.message)
      });
    });
})

/**
 * @fixme un update sur un import ou drawing supprime le layer !?
 */
onUnmounted(() => {
  if (map && layer) {
    map.removeLayer(layer)
    emit('unmounted');
  }
})

</script>

<template>
  <div>
    <slot />
  </div>
</template>
