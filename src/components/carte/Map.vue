<script setup lang="js">
import { onMounted, ref } from 'vue'

import Map from 'ol/Map'

/**
 * Reference (DOM)
 */
const mapRef = ref(0)

/**
 * Map
 * default controls are removed (rotate, zoom and attributions)
 */
const map = new Map({
  controls: [] // on supprime les contrôles par defaut !
})

onMounted(() => {
  // On déclenche l'ecriture dans le dom
  map.setTarget(mapRef.value)

  // On ajoute une option d'accessibilité
  const canvas = document.getElementById('map').getElementsByTagName('canvas')
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
    id="map"
    ref="mapRef"
    tabindex="0"
    @mouseover="onFocusOnMap">
    <slot />
  </div>
</template>

<style>
  #map {
    width: 100%;
  }
</style>
