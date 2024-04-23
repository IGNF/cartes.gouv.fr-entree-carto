<script setup lang="js">

import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM'

import SearchEngine from './control/SearchEngine.vue'
import ScaleLine from './control/ScaleLine.vue'
import OverviewMap from './control/OverviewMap.vue'

import { useControls } from '@/composables/controls'

const props = defineProps({
  controlOptions: Array
})

const scaleLineOptions = {
  units: 'metric',
  bar: false,
}

const searchEngineOptions = {
  collapsed: false,
  opened: true,
  displayButtonAdvancedSearch: true,
  displayButtonGeolocate: true,
  displayButtonCoordinateSearch: true,
  displayButtonClose: false,
  resources: {
    search: true
  }
}

const overviewMapOptions = {
  className: 'ol-overviewmap ol-custom-overviewmap',
  collapseLabel: '\u00BB',
  label: '\u00AB',
  collapsed: false,
  layers : [
    new TileLayer({
      source: new OSM(),
    })
  ]
}
</script>

<template>
  <SearchEngine
    :visibility="props.controlOptions.includes(useControls.SearchEngine)"
    :search-engine-options="searchEngineOptions"
  />
  <ScaleLine
    :visibility="props.controlOptions.includes(useControls.ScaleLine)"
    :scale-line-options="scaleLineOptions"
  />
  <OverviewMap
    :visibility="props.controlOptions.includes(useControls.OverviewMap)"
    :overview-map-options="overviewMapOptions"
  />
</template>
