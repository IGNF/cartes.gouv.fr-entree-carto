<script setup lang="js">
import { onMounted, ref } from 'vue'

import Map from 'ol/Map'

const mapRef = ref(0)

const map = new Map()

onMounted(() => {
  map.setTarget(mapRef.value)

  const canvas = document.getElementById('map').getElementsByTagName('canvas')
  if (canvas.length) {
    canvas[0].tabIndex = 0
  }
})

/**
 *  To focus on map and activate keyboard control.
 *  Trigerred on mouse over
 */
function focusOnMap () {
  mapRef.value.focus();
}

provide('map', map)
</script>

<template>
  <div
    id="map"
    ref="mapRef"
    tabindex="0"
    @mouseover="focusOnMap"
  >
    <slot />
  </div>
</template>

<style scoped></style>
