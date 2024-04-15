<script setup lang="ts">
import Map from 'ol/Map'

import { onMounted, ref } from 'vue'

const mapRef = ref<string | HTMLElement | undefined>(undefined)

const map: Map | undefined = new Map()

onMounted(() => {
  map?.setTarget(mapRef.value)

  const canvas = document.getElementById('map')?.getElementsByTagName('canvas')
  if (canvas) {
    canvas.tabindex = 0
  }
})

/**
 *  To focus on map and activate keyboard control.
 *  Trigerred on mouse over
 *
 */
function focusOnMap () {
  mapRef.value.focus()
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

<style scoped>
#map {
  margin-left: 0;
  width: 100vw;
  height: 80vh;
}
</style>
