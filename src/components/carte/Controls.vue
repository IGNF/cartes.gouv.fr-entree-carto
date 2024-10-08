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
import MousePosition from './control/MousePosition.vue'
import Territories from './control/Territories.vue';

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

const territoriesOptions = {
  position: 'bottom-left',
  panel : true,
  title : "Sélectionner un territoire",
  auto : false, // chargement auto des territoires par defaut
  thumbnail : false, // imagette des territoires
  reduce : false, // tuiles reduites par defaut
  tiles : 3
}

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

const mousePositionOptions = {
  position: 'bottom-left',
  // On ajoute les systemes UTM pour les territoires
  systems : [{
      label : "G\u00e9ographique",
      crs : "EPSG:4326",
      type : "Geographical"
    },{
      label : "Web Mercator",
      crs : "EPSG:3857",
      type : "Metric"
    },{
      label : "Lambert 93",
      crs : "EPSG:2154",
      type : "Metric",
      geoBBox : {
        left : -9.86,
        bottom : 41.15,
        right : 10.38,
        top : 51.56
      }
    },{
      label : "Lambert II \u00e9tendu",
      crs : "EPSG:27572",
      type : "Metric",
      geoBBox : {
        left : -4.87,
        bottom : 42.33,
        right : 8.23,
        top : 51.14
      }
    },{
      crs : "EPSG:32620",
      label : "UTM 20N (Guadeloupe, Martinique)",
      type : "Metric",
      geoBBox : { left: -66.00, bottom : 0.00, right : -60.00, top : 84.00 }
      
    },{
      crs : "EPSG:4467",
      label : "UTM 21N (Saint-Pierre-et-Miquelon)",
      type : "Metric",
      geoBBox : { left: -57.10, bottom : 43.41, right : -55.90, top : 47.37 }
    },{
      crs : "EPSG:2972",
      label : "UTM 22N (Guyane)",
      type : "Metric",
      geoBBox : { left: -54.60, bottom : 2.11, right : -49.46, top : 8.88 }
    },{
      crs : "EPSG:32630",
      label : "UTM 30N (France m\u00e9tropolitaine)",
      type : "Metric",
      geoBBox : { left: -6.00, bottom : 0.00, right : 0.00, top : 84.00 }
    },{
      crs : "EPSG:32631",
      label : "UTM 31N (France m\u00e9tropolitaine)",
      type : "Metric",
      geoBBox : { left: 0.00, bottom : 0.00, right : 6.00, top : 84.00 }
    },{
      crs : "EPSG:32632",
      label : "UTM 32N (France m\u00e9tropolitaine)",
      type : "Metric",
      geoBBox : { left: 6.00, bottom : 0.00, right : 12.00, top : 84.00 }
    },{
      crs : "EPSG:4471",
      label : "UTM 38S (Mayotte)",
      type : "Metric",
      geoBBox : { left: 43.68, bottom : -14.49, right : 46.70, top : -11.33 }
    },{
      crs : "EPSG:2975",
      label : "UTM 40S (R\u00e9union)",
      type : "Metric",
      geoBBox : { left: 51.83, bottom : -24.72, right : 58.24, top : -18.28 }
    },{
      crs : "EPSG:3296",
      label : "UTM 5S (Polyn\u00e9sie)",
      type : "Metric",
      geoBBox : { left: -158.13, bottom : -26.70, right : -150.00, top : -12.50 }
    },{
      crs : "EPSG:3297",
      label : "UTM 6S (Polyn\u00e9sie)",
      type : "Metric",
      geoBBox : { left: -150.00, bottom : -31.20, right : -144.00, top : -7.29 }
    },{
      crs : "EPSG:32707",
      label : "UTM 7S (Polyn\u00e9sie)",
      type : "Metric",
      geoBBox : { left: -144.00, bottom : -80.00, right : -138.00, top : 0.00 }
    },{
      crs : "EPSG:32708",
      label : "UTM 8S (Polyn\u00e9sie)",
      type : "Metric",
      geoBBox : {left: -138.00, bottom : -80.00, right : -132.00, top : 0.00 }
    },{
      crs : "EPSG:26912",
      label : "UTM 12N (\u00cele de Clipperton)",
      type : "Metric",
      geoBBox : { left: -109.5, bottom : 10.17, right : -109, top : 10.5 }
    },{
      crs : "EPSG:32742",
      label : "UTM 42S (\u00celes Kerguelen)",
      type : "Metric",
      geoBBox : { left: 66.00, bottom : -80.00, right : 72.00, top : 0.00 }
    },{
      crs : "EPSG:32739",
      label : "UTM 39S (\u00celes Crozet)",
      type : "Metric",
      geoBBox : { left: 48.00, bottom : -80.00, right : 54.00, top : 0.00 }
    },{
      crs : "EPSG:32743",
      label : "UTM 43S (\u00celes St-Paul et Amsterdam)",
      type : "Metric",
      geoBBox : { left: 72.00, bottom : -80.00, right : 78.00, top : 0.00 }
    },{
      crs : "EPSG:2986",
      label : "Stéréographique polaire (Terre Ad\u00e9lie)",
      type : "Metric",
      geoBBox : { left: 136.00, bottom : -67.13, right : 142.00, top : -65.61 }
    },{
      crs : "EPSG:32737",
      label : "UTM 37S (\u00celes du canal de Mozambique)",
      type : "Metric",
      geoBBox : { left: 36.00, bottom : -80.00, right : 42.00, top : 0.00 }
    },{
      crs : "EPSG:32738",
      label : "UTM 38S (\u00celes du canal de Mozambique)",
      type : "Metric",
      geoBBox : { left: 42.00, bottom : -80.00, right : 48.00, top : 0.00 }
    },{
      crs : "EPSG:2988",
      label : "UTM 1S (Wallis-et-Futuna)",
      type : "Metric",
      geoBBox : { left: -176.25, bottom : -13.41, right : -176.07, top : -13.16 }
    },{
      crs : "EPSG:3163",
      label : "RGNC91-93 (Nouvelle-Cal\u00e9donie)",
      type : "Metric",
      geoBBox : { left: 156.25, bottom : -26.45, right : 174.28, top : -14.83 }
    }
  ]
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
  <Territories
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Territories.id)"
    :analytic="useControls.Territories.analytic"
    :territories-options="territoriesOptions"
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
  <MousePosition
  v-if="controlOptions"
  :visibility="props.controlOptions.includes(useControls.MousePosition.id)"
  :analytic="useControls.MousePosition.analytic"
  :mouse-position-options="mousePositionOptions"
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
    top: 98px;
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
    top: 164px;
  }
}
</style>
