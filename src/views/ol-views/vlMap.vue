<script setup lang="ts">
// import Map from 'ol/Map'
import Map from 'ol/Map'

import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'
import { onMounted, ref } from 'vue'

const mapRef = ref<string | HTMLElement | undefined>(undefined)

const map: Map | undefined = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ]
})

onMounted(() => {
  map?.setTarget(mapRef.value)
})

provide('map', map)
</script>

<template>
  <div
    id="map"
    ref="mapRef"
  >
    <slot />
  </div>
</template>

<style scoped>
#map {
  margin-left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
