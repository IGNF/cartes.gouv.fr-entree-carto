<script setup lang="ts">
import TileLayer from 'ol/layer/Tile.js'
import SearchEngine from './Control/SearchEngine.vue'
import ScaleLine from './Control/ScaleLine.vue'
import OverviewMap from './Control/OverviewMap.vue'
import OSM from 'ol/source/OSM';

const props = defineProps({
  controlOptions : Array
})

const units = "metric";
const miniMapLayer = new TileLayer({
  source: new OSM(),
})
</script>


<template>
  <SearchEngine
    :visibility="props.controlOptions?.includes('SearchEngine')"
    />
  <ScaleLine
    :visibility="props.controlOptions?.includes('ScaleLine')"
    :units="units"
    />
  <OverviewMap
    :visibility="props.controlOptions?.includes('OverviewMap')"
    :layer="miniMapLayer"
    />
</template>

