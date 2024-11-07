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
import { onMounted, ref } from 'vue'
import { CRS } from 'geopf-extensions-openlayers'

import Map from 'ol/Map'
import { useMapStore } from "@/stores/mapStore"
const mapStore = useMapStore()

const props = defineProps({
  symbolName: Symbol
})

/**
 * Reference (DOM)
 */
const mapRef = ref(null)
const id = computed(() => {
  return props.symbolName.toString().match(/\((.*)\)/)[1]
})

/**
 * Map
 * default controls are removed (rotate, zoom and attributions)
 */
const map = new Map({
  target: id.value,
  controls: [] // on supprime les contrôles par defaut !
})


onMounted(() => {
  // On déclenche l'ecriture dans le dom
  console.log("set print map")
  console.log(props.symbolName)
  CRS.load();
  map.setTarget(mapRef.value)

  // On ajoute une option d'accessibilité
  const canvas = mapRef.value.getElementsByTagName('canvas')
  if (canvas.length) {
    canvas[0].tabIndex = 0
  }
})

onUpdated(() => {
  console.log(map)
  console.log(props.symbolName)
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

// INFO
// Option permettant de rendre disponible 'map'
// aux composants enfants imbriqués
provide(props.symbolName, map)
mapStore.setMap(map)
// on expose en publique la reference au DOM
defineExpose({
  mapRef,
  updateSize
});
</script>

<template>
  <div
    ref="mapRef"
    tabindex="0"
    @mouseover="onFocusOnMap">
    <slot />
  </div>
</template>

<style>
</style>
