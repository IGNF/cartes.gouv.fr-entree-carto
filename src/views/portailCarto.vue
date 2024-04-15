<script setup lang="ts">
import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'
import vlMap from './ol-views/vlMap.vue'
import vlView from './ol-views/vlView.vue'
import vlControl from './ol-views/vlControl.vue'

const zoom = 10
const center = [-234814.550892, 4774562.534805]
const units = 'metric'
const miniMapLayer = new TileLayer({
  source: new OSM(),
})
const layers = [new TileLayer({
  source: new OSM(),
})]
</script>

<template>
  <vlMap>
    <vlView
      :center="center"
      :zoom="zoom"
      :layers="layers"
    />
    <vlControl
      :units="units"
      :layer="miniMapLayer"
    />
  </vlMap>
</template>
