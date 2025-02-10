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

map.on('loadstart', function () {
  map.getTargetElement().classList.add('spinner');
});

map.on('loadend', function () {
  map.getTargetElement().classList.remove('spinner');
});

provide(props.mapId, map)

onMounted(() => {
  // On déclenche l'ecriture dans le dom
  
  CRS.load();
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
  @mouseover="onFocusOnMap">
  <slot />
</div>
</template>

<style>
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
.spinner:after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  border-radius: 50%;
  border: 5px solid rgba(180, 180, 180, 0.6);
  border-top-color: rgba(0, 0, 0, 0.6);
  animation: spinner 0.6s linear infinite;
}
</style>
