<script setup lang="js">
import SearchEngine from './control/SearchEngine.vue'
import ScaleLine from './control/ScaleLine.vue'
import OverviewMap from './control/OverviewMap.vue'
import Zoom from './control/Zoom.vue'
import Attributions from './control/Attributions.vue'
import LayerSwitcher from './control/LayerSwitcher.vue'
import Isocurve from './control/Isocurve.vue'
import MeasureLength from './control/MeasureLength.vue'
import MeasureArea from './control/MeasureArea.vue'
import MeasureAzimuth from './control/MeasureAzimuth.vue'
import GetFeatureInfo from './control/GetFeatureInfo.vue'

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
    // position : "top-right",
    collapsed: true,
    panel: true,
    counter: true
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
    addToMap: false,
    serviceOptions: {
      services: 'WMTS,WMS,TMS'
    }
  }
}

const overviewMapOptions = {
  position: 'bottom-left'
}

const getFeatureInfoOptions = {
  options : {
    position: 'bottom-left',
    hidden: false,
    auto: true,
    active: true
  }
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
    :visibility="props.controlOptions.includes(useControls.LayerSwitcher.id)"
    :layer-switcher-options="layerSwitcherOptions"
  />
  <Isocurve
    :visibility="props.controlOptions.includes(useControls.Isocurve.id)"
    :isocurve-options="isocurveOptions"
  />
  <ReverseGeocode
    :visibility="props.controlOptions.includes(useControls.ReverseGeocode.id)"
    :reverse-geocode-options="reverseGeocodeOptions"
  />
  <FullScreen
    :visibility="props.controlOptions.includes(useControls.FullScreen.id)"
    :fullscreen-options="fullscreenOptions"
  />
  <Zoom
    :visibility="props.controlOptions.includes(useControls.Zoom.id)"
    :zoom-options="zoomOptions"
  />
  <Attributions
    :visibility="props.controlOptions.includes(useControls.Attributions.id)"
    :attributions-options="attributionsOptions"
  />
  <SearchEngine
    :visibility="props.controlOptions.includes(useControls.SearchEngine.id)"
    :search-engine-options="searchEngineOptions"
  />
  <ScaleLine
    :visibility="props.controlOptions.includes(useControls.ScaleLine.id)"
    :scale-line-options="scaleLineOptions"
  />
  <OverviewMap
    :visibility="props.controlOptions.includes(useControls.OverviewMap.id)"
    :overview-map-options="overviewMapOptions"
  />
  <MeasureLength
    :visibility="props.controlOptions.includes(useControls.MeasureLength.id)"
    :measure-length-options="measureLengthOptions"
  />
  <MeasureArea
    :visibility="props.controlOptions.includes(useControls.MeasureArea.id)"
    :measure-area-options="measureAreaOptions"
  />
  <MeasureAzimuth
    :visibility="props.controlOptions.includes(useControls.MeasureAzimuth.id)"
    :measure-azimuth-options="measureAzimuthOptions"
  />
  <GetFeatureInfo
    :visibility="props.controlOptions.includes(useControls.GetFeatureInfo.id)"
    :get-feature-info-options="getFeatureInfoOptions"
  />
</template>

<style>
  .position-container-bottom-left,
  .position-container-bottom-right,
  .position-container-top-left,
  .position-container-top-right {
    border-style: unset;
  }
  .position-container-top-right {
    top: 90px;
  }
</style>
