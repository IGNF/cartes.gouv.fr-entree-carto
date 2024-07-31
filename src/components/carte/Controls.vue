<script setup lang="js">
import SearchEngine from './control/SearchEngine.vue'
import ScaleLine from './control/ScaleLine.vue'
import OverviewMap from './control/OverviewMap.vue'
import Zoom from './control/Zoom.vue'
import Attributions from './control/Attributions.vue'
import LayerSwitcher from './control/LayerSwitcher.vue'
import Legends from './control/Legends.vue'
import Isocurve from './control/Isocurve.vue'
import MeasureLength from './control/MeasureLength.vue'
import MeasureArea from './control/MeasureArea.vue'
import MeasureAzimuth from './control/MeasureAzimuth.vue'

import { useControls } from '@/composables/controls'
import { useLogger } from 'vue-logger-plugin'

const props = defineProps({
  controlOptions: Array
})

// INFO
// liste des contrôles à activer
// Ex. 
// Array(10) : [
//  "OverviewMap",
//  "SearchEngine",
//  "ScaleLine",
//  "LayerSwitcher",
//  "Legends",
//  undefined,
//  undefined,
//  "Zoom",
//  undefined,
//  undefined,
//  "FullScreen"
// ]
const log = useLogger()
log.debug(props.controlOptions);

// liste des options pour les contrôles
const layerSwitcherOptions = {
  options: {
    position : "top-right",
    collapsed: true,
    panel: true,
    counter: true
  }
}
const legendsOptions = {
  position : "top-right",
  panel: true,
  auto: true,
  draggable: false
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
    addToMap: false,
    filterServices : "WMTS,WMS,TMS",
    serviceOptions: {}
  }
}

const overviewMapOptions = {
  position: 'bottom-left'
}

const zoomOptions = {
  position: 'bottom-right',
}

const attributionsOptions = {}

// FIXME exception sur la position
const isocurveOptions = {
  position: 'bottom-right'
}

const reverseGeocodeOptions = {
  position: 'bottom-right'
}

const fullscreenOptions = {
  position: 'bottom-right'
}

// FIXME map.getTargetElement() n'existe pas encore !
const measureLengthOptions = {
  position: 'top-left'
}
const measureAreaOptions = {
  position: 'top-left'
}
const measureAzimuthOptions = {
  position: 'top-left'
}

</script>
<!-- INFO : Affichage du contrôle
  >>> option visibility:true, si le contrôle est dans la liste
  >>> sinon, visibility:false
-->
<template>
  <LayerSwitcher
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.LayerSwitcher.id)"
    :layer-switcher-options="layerSwitcherOptions"
  />
  <Legends
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Legends.id)"
    :legends-options="legendsOptions"
  />
  <Isocurve
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Isocurve.id)"
    :isocurve-options="isocurveOptions"
  />
  <ReverseGeocode
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ReverseGeocode.id)"
    :reverse-geocode-options="reverseGeocodeOptions"
  />
  <FullScreen
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.FullScreen.id)"
    :fullscreen-options="fullscreenOptions"
  />
  <Zoom
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Zoom.id)"
    :zoom-options="zoomOptions"
  />
  <Attributions
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Attributions.id)"
    :attributions-options="attributionsOptions"
  />
  <SearchEngine
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.SearchEngine.id)"
    :search-engine-options="searchEngineOptions"
  />
  <ScaleLine
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ScaleLine.id)"
    :scale-line-options="scaleLineOptions"
  />
  <OverviewMap
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.OverviewMap.id)"
    :overview-map-options="overviewMapOptions"
  />
  <MeasureLength
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureLength.id)"
    :measure-length-options="measureLengthOptions"
  />
  <MeasureArea
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureArea.id)"
    :measure-area-options="measureAreaOptions"
  />
  <MeasureAzimuth
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureAzimuth.id)"
    :measure-azimuth-options="measureAzimuthOptions"
  />
</template>

<style>

  .position-container-bottom-left,
  .position-container-bottom-right,
  .position-container-top-left,
  .position-container-top-right {
    margin: 0;
    padding: 0;
  }

  @media (min-width: 576px) {
    .position-container-top-right,
    .position-container-top-left {
      top: 56px;
    }
  }
  @media (max-width: 576px) {
    .position-container-top-right,
    .position-container-top-left {
      top: 210px;
    }
  }
  @media (max-width: 627px) and (min-width: 576px){
    .position-container-top-right,
    .position-container-top-left {
      top: 120px;
    }
  }
</style>
