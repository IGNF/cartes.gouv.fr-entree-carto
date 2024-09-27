<script setup lang="js">
import SearchEngine from './control/SearchEngine.vue'
import ScaleLine from './control/ScaleLine.vue'
import OverviewMap from './control/OverviewMap.vue'
import Zoom from './control/Zoom.vue'
import Attributions from './control/Attributions.vue'
import LayerSwitcher from './control/LayerSwitcher.vue'
import Legends from './control/Legends.vue'
import Isocurve from './control/Isocurve.vue'
import Route from './control/Route.vue'
import MeasureLength from './control/MeasureLength.vue'
import MeasureArea from './control/MeasureArea.vue'
import MeasureAzimuth from './control/MeasureAzimuth.vue'

import Share from './control/Share.vue'

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

// liste des options pour les contrôles;

const shareOptions = {};

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

const isocurveOptions = {
  position: 'bottom-right'
}

const routeOptions = {
  position: 'bottom-right'
}

const reverseGeocodeOptions = {
  position: 'bottom-right'
}

const fullscreenOptions = {
  position: 'bottom-right'
}

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
  <Share
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Share.id)"
    :share-options="shareOptions"
  />
  <LayerSwitcher
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.LayerSwitcher.id)"
    :analytic="useControls.LayerSwitcher.analytic"
    :layer-switcher-options="layerSwitcherOptions"
  />
  <Legends
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Legends.id)"
    :analytic="useControls.Legends.analytic"
    :legends-options="legendsOptions"
  />
  <Route
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Route.id)"
    :analytic="useControls.Route.analytic"
    :route-options="routeOptions"
  />
  <Isocurve
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Isocurve.id)"
    :analytic="useControls.Isocurve.analytic"
    :isocurve-options="isocurveOptions"
  />
  <ReverseGeocode
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ReverseGeocode.id)"
    :analytic="useControls.ReverseGeocode.analytic"
    :reverse-geocode-options="reverseGeocodeOptions"
  />
  <FullScreen
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.FullScreen.id)"
    :analytic="useControls.FullScreen.analytic"
    :fullscreen-options="fullscreenOptions"
  />
  <Zoom
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Zoom.id)"
    :analytic="useControls.Zoom.analytic"
    :zoom-options="zoomOptions"
  />
  <Attributions
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Attributions.id)"
    :analytic="useControls.Attributions.analytic"
    :attributions-options="attributionsOptions"
  />
  <SearchEngine
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.SearchEngine.id)"
    :analytic="useControls.SearchEngine.analytic"
    :search-engine-options="searchEngineOptions"
  />
  <ScaleLine
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ScaleLine.id)"
    :analytic="useControls.ScaleLine.analytic"
    :scale-line-options="scaleLineOptions"
  />
  <OverviewMap
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.OverviewMap.id)"
    :analytic="useControls.OverviewMap.analytic"
    :overview-map-options="overviewMapOptions"
  />
  <MeasureLength
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureLength.id)"
    :analytic="useControls.MeasureLength.analytic"
    :measure-length-options="measureLengthOptions"
  />
  <MeasureArea
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureArea.id)"
    :analytic="useControls.MeasureArea.analytic"
    :measure-area-options="measureAreaOptions"
  />
  <MeasureAzimuth
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureAzimuth.id)"
    :analytic="useControls.MeasureAzimuth.analytic"
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
