<script setup lang="js">
import { onMounted, ref } from 'vue'

import Map from 'ol/Map'

/**
 * Reference (DOM)
 */
const mapRef = ref(0)
const id = "map"

// on expose en publique la reference au DOM
defineExpose({
  mapRef
});

/**
 * Map
 * default controls are removed (rotate, zoom and attributions)
 */
const map = new Map({
  target: id,
  controls: [] // on supprime les contrôles par defaut !
})


onMounted(() => {
  // On déclenche l'ecriture dans le dom
  map.setTarget(mapRef.value)

  // On ajoute une option d'accessibilité
  const canvas = document.getElementById(id).getElementsByTagName('canvas')
  if (canvas.length) {
    canvas[0].tabIndex = 0
  }
})

/**
 *  To focus on map and activate keyboard control.
 *  Trigerred on mouse over
 */
const onFocusOnMap = () => {
  // Si le focus est actuellement sur une balise <input>, on ne change pas de focus
  if (document.activeElement.tagName !== "INPUT") {
    mapRef.value.focus();
  }
}

// INFO
// Option permettant de rendre disponible 'map' 
// aux composants enfants imbriqués
provide('map', map)

</script>

<template>
  <div
    :id="id"
    ref="mapRef"
    tabindex="0"
    @mouseover="onFocusOnMap">
    <slot />
  </div>
</template>

<style>
  #map {
    position: absolute;
    width: 100%;
    height: inherit;
  }
</style>
