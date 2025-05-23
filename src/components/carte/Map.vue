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

import Map from 'ol/Map'
import { useMapStore } from "@/stores/mapStore"
import { mainMap } from "@/composables/keys"

const mapStore = useMapStore()

const props = defineProps({
  mapId: String
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
  controls: [] // on supprime les contrôles par defaut !
})

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

provide(props.mapId, map)

onMounted(() => {
  // On déclenche l'ecriture dans le dom
  
  CRS.loadByDefault();
  map.setTarget(mapRef.value)
  
  // On ajoute une option d'accessibilité
  const canvas = mapRef.value.getElementsByTagName('canvas')
  if (canvas.length) {
    canvas[0].tabIndex = 0
  }
  if (props.mapId == mainMap)
  mapStore.setMap(map)
})

/**
 *  To focus on map and activate keyboard control.
 *  Trigerred on mouse over
 */
const onFocusOnMap = () => {
  // Si le focus est actuellement sur une balise <input> ou <select>, on ne change pas de focus
  if (document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "SELECT") {
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
