<script setup lang="ts">
import TileLayer from 'ol/layer/Tile.js'
import SearchEngine from './Control/SearchEngine.vue'
import ScaleLine from './Control/ScaleLine.vue'
import OverviewMap from './Control/OverviewMap.vue'
import OSM from 'ol/source/OSM';

import { ControlList } from '@/composables/configuration'

const props = defineProps({
  controlOptions : Array
})

const scaleLineOptions = {
  units: "metric",
  bar: false,
}

const miniMapLayer = new TileLayer({
  source: new OSM(),
})


</script>


<template>
  <SearchEngine
    :visibility="props.controlOptions?.includes(ControlList.SearchEngine)"
    />
  <ScaleLine
    :visibility="props.controlOptions?.includes(ControlList.ScaleLine)"
    :scaleLineOptions="scaleLineOptions"
    />
  <OverviewMap
    :visibility="props.controlOptions?.includes(ControlList.OverviewMap)"
    :layer="miniMapLayer"
    />
</template>

