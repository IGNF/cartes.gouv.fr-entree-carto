<script setup lang="js">

import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM'

import SearchEngine from './control/SearchEngine.vue'
import ScaleLine from './control/ScaleLine.vue'
import OverviewMap from './control/OverviewMap.vue'
import Zoom from './control/Zoom.vue'
import Attributions from './control/Attributions.vue'

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
  },
  searchOptions: {
    serviceOptions : {
      services: "WMTS,WMS,TMS"
    }
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

const zoomOptions = {}
const attributionsOptions = {}

</script>

<template>
  <Zoom
    :visibility="props.controlOptions.includes(useControls.Zoom)"
    :zoom-options="zoomOptions"
  />
  <Attributions
    :visibility="props.controlOptions.includes(useControls.Attributions)"
    :attributions-options="attributionsOptions"
  />
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

