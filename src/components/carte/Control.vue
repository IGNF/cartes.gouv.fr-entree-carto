<script setup lang="js">

import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM'

import SearchEngine from './control/SearchEngine.vue'
import ScaleLine from './control/ScaleLine.vue'
import OverviewMap from './control/OverviewMap.vue'
import Zoom from './control/Zoom.vue'
import Attributions from './control/Attributions.vue'
import LayerSwitcher from './control/LayerSwitcher.vue'
import Isocurve from './control/Isocurve.vue'

const props = defineProps({
  controlOptions: Object
})

const layerSwitcherOptions = {
  options : {
    position : "top-right",
    collapsed : true,
    panel : true,
    counter : true
  }
}

const scaleLineOptions = {
  units: 'metric',
  bar: false,
}

const searchEngineOptions = {
  collapsed: false,
  collapsible: false,
  displayButtonAdvancedSearch: true,
  displayButtonGeolocate: true,
  displayButtonCoordinateSearch: true,
  displayButtonClose: false,
  resources: {
    search: true
  },
  searchOptions: {
    addToMap : false,
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

const zoomOptions = {
  position : "top-right",
}

const attributionsOptions = {}

// FIXME exception
const isocurveOptions = {
  position : "top-left"
}

const reverseGeocodeOptions = {
  position : "top-left"
}

</script>

<template>
  <LayerSwitcher
    :visibility="props.controlOptions.LayerSwitcher.active"
    :layer-switcher-options="layerSwitcherOptions"
  />
  <Isocurve
    :visibility="props.controlOptions.Isocurve.active"
    :isocurve-options="isocurveOptions"
  />
  <ReverseGeocode
    :visibility="props.controlOptions.ReverseGeocode.active"
    :reverse-geocode-options="reverseGeocodeOptions"
  />
  <Zoom
    :visibility="props.controlOptions.Zoom.active"
    :zoom-options="zoomOptions"
  />
  <Attributions
    :visibility="props.controlOptions.Attributions.active"
    :attributions-options="attributionsOptions"
  />
  <SearchEngine
    :visibility="props.controlOptions.SearchEngine.active"
    :search-engine-options="searchEngineOptions"
  />
  <ScaleLine
    :visibility="props.controlOptions.ScaleLine.active"
    :scale-line-options="scaleLineOptions"
  />
  <OverviewMap
    :visibility="props.controlOptions.OverviewMap.active"
    :overview-map-options="overviewMapOptions"
  />
</template>

