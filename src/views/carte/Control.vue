<script setup lang="ts">
import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM'
import SearchEngine from './Control/SearchEngine.vue'
import ScaleLine from './Control/ScaleLine.vue'
import OverviewMap from './Control/OverviewMap.vue'

import { ControlList } from '@/composables/configuration'

const props = defineProps({
  controlOptions: Array
})

const scaleLineOptions = {
  units: 'metric',
  bar: false,
}

const searchEngineOptions = {
  collapsed: false,
}

const miniMapLayer = new TileLayer({
  source: new OSM(),
})
</script>

<template>
  <SearchEngine
    :visibility="props.controlOptions?.includes(ControlList.SearchEngine)"
    :search-engine-options="searchEngineOptions"
  />
  <ScaleLine
    :visibility="props.controlOptions?.includes(ControlList.ScaleLine)"
    :scale-line-options="scaleLineOptions"
  />
  <OverviewMap
    :visibility="props.controlOptions?.includes(ControlList.OverviewMap)"
    :layer="miniMapLayer"
  />
</template>
