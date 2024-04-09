
<script setup lang="ts">
// import Map from 'ol/Map'
import Map, { type MapOptions } from "ol/Map";

import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { ref, onMounted } from "vue";

const mapRef = ref<string | HTMLElement | undefined>(undefined);

let map: Map | undefined = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ]
});

onMounted(() => {
  map?.setTarget(mapRef.value);
});

provide("map", map);

</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
  border-color: blueviolet;
}
</style>


<template>
  <div ref="mapRef" id="map">
    <slot></slot>
  </div>
</template>