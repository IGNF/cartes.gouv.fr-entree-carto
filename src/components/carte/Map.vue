<script setup lang="js">
import { onMounted, ref } from 'vue'

import Map from 'ol/Map'

/**
 * Reference (DOM)
 */
const mapRef = ref(0)

/**
 * Map
 */
const map = new Map({
  controls: [] // on supprime les contrôles par defaut !
})

onMounted(() => {
  // ecriture dans le dom
  map.setTarget(mapRef.value)

  // accessibilité
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
  mapRef.value.focus();
}

// rendre disponible 'map' aux composants enfannts imbriqués
provide('map', map)

</script>

<template>
  <div
    id="map"
    ref="mapRef"
    tabindex="0"
    @mouseover="onFocusOnMap"
  >
    <slot />
  </div>
</template>

<style scoped></style>
