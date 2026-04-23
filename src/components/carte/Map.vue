<script lang="js">
/**
* @description
* Initialisation de la carte OpenLayer
*
*/
export default {
  name: 'Map'
};
</script>

<script setup lang="js">
import { CRS } from 'geopf-extensions-openlayers'

import { Map, View } from 'ol'
import {
    MouseWheelZoom,
    defaults as defaultInteractions
} from "ol/interaction";
import {
    shiftKeyOnly as eventShiftKeyOnly
} from "ol/events/condition";
import { fromLonLat, toLonLat, transform } from "ol/proj";

import { useMapStore } from "@/stores/mapStore"
import { mainMap } from "@/composables/keys"
import { useLogger } from 'vue-logger-plugin';

const mapStore = useMapStore()
const log = useLogger()

const props = defineProps({
  mapId: {
    type: String,
    default: 'mainMap'
  },
})

/**
* Reference (DOM)
*/
const mapRef = ref(null)

/**
* Map
* default controls are removed (rotate, zoom and attributions)
*/
const map = new Map({
  target: props.mapId,
  controls: [], // on supprime les contrôles par defaut !
  interactions : defaultInteractions().extend([
    new MouseWheelZoom({
      constrainResolution : true,
      condition : eventShiftKeyOnly
    })
  ]),
  view: new View({
    zoom: mapStore.zoom,
    center: fromLonLat(mapStore.center), // 3857
    minZoom : 0,
    maxZoom : 21,
    projection : "EPSG:3857"
  }),
});

/**
 * INFO
 * On utilise le loadstart et loadend de la carte pour faire un reset de l'url (en cas de load Permalink)
 * On utilise un timeout pour gérer le cas où le loadend ne se déclenche pas
 */
const fallbackTimeouts = new Set();
const fallbackDelay = 5000; // délai maximum pour un "loadend" naturel
const url = location.origin + location.pathname;

function startLoading() {
    // Démarre un fallback timeout au cas où `loadend` ne survient pas
    const timeoutId = setTimeout(() => {
      console.warn('Fallback loadend déclenché');
      endLoading();
      fallbackTimeouts.delete(timeoutId);
    }, fallbackDelay);
  
    fallbackTimeouts.add(timeoutId);
}
function endLoading() {
    // HACK
    // Pour les couches issues des favoris, on impose un "zoom to extent".
    // Mais, on ne souhaite pas l'appliquer sur des données issues d'un permalien.
    // En reinitialisant l'url du permalien, on interdit le "zoom to extent" des données issues 
    // du permalien.
    // cf. mapStore.isPermalink
    // cf. Layer.vue
    history.pushState(null, '', url);
}

map.on('loadstart', startLoading);
map.on('loadend', () => {
  // Lors d’un vrai loadend, on supprime un timeout s’il en reste
  const timeoutId = fallbackTimeouts.values().next().value;
  if (timeoutId) {
    clearTimeout(timeoutId);
    fallbackTimeouts.delete(timeoutId);
  }
  
  endLoading();
});

let updateMapView = () => {
  let view = map.getView();
  let center = view.getCenter(); // 3857
  mapStore.x = center[0]; // 3857
  mapStore.y = center[1]; // 3857

  let coordinate = toLonLat(center); // 4326
  mapStore.lon = coordinate[0]; // 4326
  mapStore.lat = coordinate[1]; // 4326

  mapStore.zoom = view.getZoom();
}

/**
 * abonnement à l'evenement 'moveend' de la map
 * pour mise à jour du centre de la carte
 */
map.on("moveend", () => {
  updateMapView();
});

watch(() => mapStore.isPlanisphereMode, (isPlanisphereMode) => {
  if (isPlanisphereMode) {
    map.setTarget(null);
  } else {
    let view = map.getView();
    view.setCenter(fromLonLat(mapStore.center));
    view.setZoom(mapStore.zoom);
    map.setTarget(mapRef.value);
    setTimeout(() => updateSize, 0);
  }
})

provide(props.mapId, map)

onMounted(() => {
  log.debug("Map component mounted")
  // On déclenche l'ecriture dans le dom
  
  CRS.loadByDefault();
  if (mapStore.isPlanisphereMode) {
    map.setTarget(null);
  } else {
    map.setTarget(mapRef.value);
  }
  
  // On ajoute une option d'accessibilité
  const canvas = mapRef.value.getElementsByTagName('canvas')
  if (canvas.length) {
    canvas[0].tabIndex = 0
  }
  if (props.mapId == mainMap) {
    mapStore.setMap(map)
  }
})

/**
 *  To focus on map and activate keyboard control.
 *  Trigerred on mouse over
 */
const onFocusOnMap = () => {
  // Si le focus est actuellement sur une balise <input> ou <select> ou sur la barre de recherche dépliée, on ne change pas de focus
  var btn = document.querySelector("button[id^=GPSearchEngine-advanced-btn-]");
  if (document.activeElement.tagName !== "INPUT" && 
      document.activeElement.tagName !== "SELECT" && 
      (!btn || btn.getAttribute("aria-expanded") !== "true")) {
    mapRef.value.focus();
  }
}
  
const updateSize = () => {
  map.updateSize();
}
  
// on expose en publique la reference au DOM
defineExpose({
  mapRef,
  updateSize
});
</script>

<template>
  <div
    :id="mapId"
    ref="mapRef"
    tabindex="0"
    @mouseover="onFocusOnMap"
  >
    <slot />
  </div>
</template>

<style>
#mainMap {
  outline : none;
}
</style>
