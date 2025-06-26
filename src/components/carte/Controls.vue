<script lang="js">
  /**
   * @description
   *
   * @property { Array } controlOptions tableau contenant les controls disponibles
   *
   */
  export default {
    name: 'Controls'
  };
</script>

<script setup lang="js">
import SearchEngine from './control/SearchEngine.vue';
import ScaleLine from './control/ScaleLine.vue';
import OverviewMap from './control/OverviewMap.vue';
import Zoom from './control/Zoom.vue';
import LayerSwitcher from './control/LayerSwitcher.vue';
import Legends from './control/Legends.vue';
import Drawing from './control/Drawing.vue';
import Isocurve from './control/Isocurve.vue';
import Route from './control/Route.vue';
import MeasureLength from './control/MeasureLength.vue';
import MeasureArea from './control/MeasureArea.vue';
import MeasureAzimuth from './control/MeasureAzimuth.vue';
import MousePosition from './control/MousePosition.vue';
import ElevationPath from './control/ElevationPath.vue';
import Territories from './control/Territories.vue';
import GetFeatureInfo from './control/GetFeatureInfo.vue';
import LayerImport from './control/LayerImport.vue';
import ControlList from './control/ControlList.vue';
import ContextMenu from './control/ContextMenu.vue';
import FullScreen from './control/FullScreen.vue';
import ReverseGeocode from './control/ReverseGeocode.vue';
import Reporting from './control/Reporting.vue';

import { useDomStore } from '@/stores/domStore';
import { useMapStore } from "@/stores/mapStore";
import { useDataStore } from '@/stores/dataStore';
import { useControls, useControlsExtensionPosition } from '@/composables/controls';
import { useLogger } from 'vue-logger-plugin';

import IconGeolocationSVG from "../../assets/geolocation.svg";

import { LoggerUtils } from 'geopf-extensions-openlayers';

const emitter = inject('emitter');

const isProduction = (import.meta.env.MODE === "production");
isProduction ? LoggerUtils.disableAll() : LoggerUtils.enableAll();

const props = defineProps({
  controlOptions: Array,
  mapId: String
});

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
//  (...)
// ]
const mapStore = useMapStore();
const domStore = useDomStore();
const dataStore = useDataStore();
const log = useLogger();
log.debug(props.controlOptions);


// liste des options pour les contrôles
const searchEngineOptions = {
  id: "1",
  collapsed: false,
  collapsible: false,
  displayButtonAdvancedSearch: true,
  displayButtonGeolocate: true,
  displayButtonCoordinateSearch: true,
  coordinateSearchInAdvancedSearch: true,
  displayButtonClose: false,
  resources: {
    search: true
  },
  searchOptions: {
    addToMap: false,
    filterServices : dataStore.filterServices,
    filterWMTSPriority : true,
    filterProjections : dataStore.filterProjections,
    filterLayersPriority : dataStore.getFeatured().toString(),
    filterLayers : true,
    filterTMS : true,
    filterLayersList : dataStore.getLayersSignatures(),
    serviceOptions : {
      maximumResponses : 50
    },
    maximumEntries : 5
  },
  autocompleteOptions : {
    serviceOptions : {
        maximumResponses : 10
    },
    prettifyResults : true,
    maximumEntries : 5
  },
  markerUrl : IconGeolocationSVG
};

const layerSwitcherOptions = {
  options: {
    id: "2",
    position : useControlsExtensionPosition().layerSwitcherOptions,
    collapsed: true,
    panel: true,
    counter: true,
    allowEdit: true,
    allowGrayScale: true
  }
};

const legendsOptions = {
  id: "3",
  position: useControlsExtensionPosition().legendsOptions,
  panel: true,
  auto: true,
  draggable: false
};

const scaleLineOptions = {
  id: "4",
  units: 'metric',
  bar: false,
};

const territoriesOptions = {
  id: "5",
  position: useControlsExtensionPosition().territoriesOptions,
  panel : true,
  title : "Sélectionner un territoire",
  auto : false, // chargement auto des territoires par defaut
  thumbnail : false, // imagette des territoires
  reduce : false, // tuiles reduites par defaut
  tiles : 3,
};

// actif par défaut
const getFeatureInfoOptions = {
  id: "6",
  position: useControlsExtensionPosition().getFeatureInfoOptions
};

const overviewMapOptions = {
  id: "7",
  position: useControlsExtensionPosition().overviewMapOptions
};

const fullscreenOptions = {
  id: "8",
  position: useControlsExtensionPosition().fullscreenOptions,
  source : "map-and-tools-container" // ID du container CartoAndTools
};

const zoomOptions = {
  position: useControlsExtensionPosition().zoomOptions,
  id: "9",
};

const controlListOptions = {
  position: useControlsExtensionPosition().controlListOptions,
  id: "10",
  gutter: false,
  controlCatalogElement: document.getElementById('MenuControl'),
}

const drawingOptions = {
  id: "11",
  position: useControlsExtensionPosition().drawingOptions,
  gutter: false,
  listable: true,
  tools : {
    "export" : false
  }
}

const reverseGeocodeOptions = {
  id: "12",
  position: useControlsExtensionPosition().reverseGeocodeOptions,
  gutter: false,
  listable: true,
};

const isocurveOptions = {
  position: useControlsExtensionPosition().isocurveOptions,
  id: "13",
  gutter: false,
  listable: true,
};

const routeOptions = {
  position: useControlsExtensionPosition().routeOptions,
  id: "14",
  gutter: false,
  listable: true,
};

const measureLengthOptions = {
  id: "15",
  position: useControlsExtensionPosition().measureLengthOptions,
  gutter: false,
  listable: true,
};

const measureAreaOptions = {
  position: useControlsExtensionPosition().measureAreaOptions,
  id: "16",
  gutter: false,
  listable: true,
};

const measureAzimuthOptions = {
  position: useControlsExtensionPosition().measureAzimuthOptions,
  gutter: false,
  listable: true,
  id: "17",
};

const mousePositionOptions = {
  position: useControlsExtensionPosition().mousePositionOptions,
  id: "18",
  gutter: false,
  listable: true,
  // On ajoute les systemes UTM pour les territoires
  systems : [
    {
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
};

const elevationPathOptions = {
  id: "19",
  position: useControlsExtensionPosition().elevationPathOptions,
  gutter: false,
  listable: true,
};

const layerImportOptions = {
  id: "20",
  position: useControlsExtensionPosition().layerImportOptions,
  gutter: false,
  listable: true,
};

const reportingOptions = {
  id: "21",
  position: useControlsExtensionPosition().reportingOptions,
  gutter: false,
  listable: true,
  format : "kml"
};

const refModalPrint = inject("refModalPrint")
const refModalShare = inject("refModalShare")

const contextMenuOptions = computed(() => {
  return {
    contextMenuItemsOptions : [
      {
        text : "Imprimer la carte",
        callback : function() {
          refModalPrint.value.onModalPrintOpen()
        }
      },
      {
        text : "Partager la carte",
        callback : function() {
          refModalShare.value.onModalShareOpen()
        }
      },
      {
        text : "Ajouter des données",
        callback : () => {
          domStore.getmenuCatalogueButton().firstChild.click()
        }
      },
      {
        text : "Mes enregistrements",
        callback : () => {
          domStore.getBookmarksButton().firstChild.click()
        }
      },
      {
        text : "Signaler une anomalie",
        callback : () => {
          // on active le controle
          mapStore.addControl("Reporting");
          // envoi d'un evenement pour l'ouverture du contrôle
          setTimeout(() => {
            emitter.dispatchEvent("reporting:open:clicked", {
              open : true,
              componentName: "Reporting"
            });
          }, 0);
        }
      }
    ]
  }
})
</script>
<!-- INFO : Affichage du contrôle
>>> option visibility:true, si le contrôle est dans la liste
>>> sinon, visibility:false
-->
<template>
  <LayerSwitcher
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.LayerSwitcher.id)"
    :analytic="useControls.LayerSwitcher.analytic"
    :layer-switcher-options="layerSwitcherOptions"
    :map-id="mapId"
  />
  <Legends
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Legends.id)"
    :analytic="useControls.Legends.analytic"
    :legends-options="legendsOptions"
    :map-id="mapId"
  />
  <Route
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Route.id)"
    :analytic="useControls.Route.analytic"
    :route-options="routeOptions"
    :map-id="mapId"
  />
  <Isocurve
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Isocurve.id)"
    :analytic="useControls.Isocurve.analytic"
    :isocurve-options="isocurveOptions"
    :map-id="mapId"
  />
  <ReverseGeocode
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ReverseGeocode.id)"
    :analytic="useControls.ReverseGeocode.analytic"
    :reverse-geocode-options="reverseGeocodeOptions"
    :map-id="mapId"
  />
  <FullScreen
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.FullScreen.id)"
    :analytic="useControls.FullScreen.analytic"
    :fullscreen-options="fullscreenOptions"
    :map-id="mapId"
  />
  <Zoom
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Zoom.id)"
    :analytic="useControls.Zoom.analytic"
    :zoom-options="zoomOptions"
    :map-id="mapId"
  />
  <SearchEngine
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.SearchEngine.id)"
    :analytic="useControls.SearchEngine.analytic"
    :search-engine-options="searchEngineOptions"
    :map-id="mapId"
  />
  <GetFeatureInfo
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.GetFeatureInfo.id)"
    :analytic="useControls.GetFeatureInfo.analytic"
    :get-feature-info-options="getFeatureInfoOptions"
    :map-id="mapId"
  />
  <ScaleLine
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ScaleLine.id)"
    :analytic="useControls.ScaleLine.analytic"
    :scale-line-options="scaleLineOptions"
    :map-id="mapId"
  />
  <OverviewMap
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.OverviewMap.id)"
    :analytic="useControls.OverviewMap.analytic"
    :overview-map-options="overviewMapOptions"
    :map-id="mapId"
  />
  <Territories
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Territories.id)"
    :analytic="useControls.Territories.analytic"
    :territories-options="territoriesOptions"
    :map-id="mapId"
  />
  <MeasureLength
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureLength.id)"
    :analytic="useControls.MeasureLength.analytic"
    :measure-length-options="measureLengthOptions"
    :map-id="mapId"
  />
  <MeasureArea
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureArea.id)"
    :analytic="useControls.MeasureArea.analytic"
    :measure-area-options="measureAreaOptions"
    :map-id="mapId"
  />
  <MeasureAzimuth
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MeasureAzimuth.id)"
    :analytic="useControls.MeasureAzimuth.analytic"
    :measure-azimuth-options="measureAzimuthOptions"
    :map-id="mapId"
  />
  <MousePosition
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.MousePosition.id)"
    :analytic="useControls.MousePosition.analytic"
    :mouse-position-options="mousePositionOptions"
    :map-id="mapId"
  />
  <Drawing
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Drawing.id)"
    :analytic="useControls.Drawing.analytic"
    :drawing-options="drawingOptions"
    :map-id="mapId"
  />
  <ElevationPath
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ElevationPath.id)"
    :analytic="useControls.ElevationPath.analytic"
    :elevation-path-options="elevationPathOptions"
    :map-id="mapId"
  />
  <LayerImport
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.LayerImport.id)"
    :analytic="useControls.LayerImport.analytic"
    :layer-import-options="layerImportOptions"
    :map-id="mapId"
  />
  <ControlList
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ControlList.id)"
    :analytic="useControls.ControlList.analytic"
    :control-list-options="controlListOptions"
    :map-id="mapId"
  />
  <ContextMenu
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.ContextMenu.id)"
    :analytic="useControls.ContextMenu.analytic"
    :context-menu-options="contextMenuOptions"
    :map-id="mapId"
  />
  <Reporting
    v-if="controlOptions"
    :visibility="props.controlOptions.includes(useControls.Reporting.id)"
    :analytic="useControls.Reporting.analytic"
    :reporting-options="reportingOptions"
    :map-id="mapId"
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

/* 10 controls optionnels */
.position-container-top-right > .gpf-widget:nth-child(n+13) > button {
  display: none;
}

.position-container-top-right:has(.gpf-widget:nth-child(14)) > .gpf-widget:nth-child(n+12) > button {
  display: none;
}

.position-container-top-right:not(:has(.gpf-widget:nth-child(14))) > .gpf-widget[id^="GPcontrolList-"] > button {
  display: none;
}

.position-container-top-right:has(.gpf-widget:nth-child(14)) > .gpf-widget:nth-child(n+12)[id^="GPcontrolList-"] > button {
  display: inline-flex;
}

.position-container-top-right > div:nth-child(n+13) {
  padding: 0;
  margin: 0;
}

.position-container-top-right:has(div:nth-child(14)) > div:nth-child(n+12) {
  margin: 0;
  padding: 0;
}

.position-container-top-right:not(:has(div:nth-child(14))) > div[id^="GPcontrolList-"] {
  margin: 0;
  padding: 0;
}

.position-container-top-right:has(div:nth-child(14)) > div:nth-child(n+12)[id^="GPcontrolList-"] {
  padding: 2px;
}

/* Cas particuliers pour éviter les coins non arrondis autour de l'import qui est caché (uniquement sur l'entree carto) */
.gpf-button-no-gutter:has(+ .gpf-button-no-gutter:not([id^="GPimport-"])) > .gpf-btn-icon {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.gpf-button-no-gutter[id^="GPimport-"] + .gpf-button-no-gutter:not([id^="GPimport-"]) > .gpf-btn-icon {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.gpf-button-no-gutter:has(+ .gpf-button-no-gutter[id^="GPimport-"]) > .gpf-btn-icon,
.gpf-button-no-gutter:has(+ .gpf-widget-button[id^="GPcontrolList-"]) > .gpf-btn-icon {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
/* TODO: max-height: 639px carto sera plus grande (header et footer réduits) */
/* Que le menu +, pas de controls */
@media (max-height: 739px) {
  .position-container-top-right > .gpf-widget:nth-child(n+3) > button {
    display: none;
  }
}

/* TODO: max-height: 719px carto sera plus grande (header et footer réduits) */
/* 4 controls optionnels */
@media (max-height: 819px) {
  .position-container-top-right > .gpf-widget:nth-child(n+7) > button {
    display: none;
  }

  .position-container-top-right:has(.gpf-widget:nth-child(8)) > .gpf-widget:nth-child(n+6) > button {
    display: none;
  }

  .position-container-top-right:not(:has(.gpf-widget:nth-child(8))) > .gpf-widget[id^="GPcontrolList-"] > button {
    display: none;
  }

  .position-container-top-right:has(.gpf-widget:nth-child(8)) > .gpf-widget:nth-child(n+6)[id^="GPcontrolList-"] > button {
    display: inline-flex;
  }

  .position-container-top-right > div:nth-child(n+7) {
    margin: 0;
    padding: 0;
  }

  .position-container-top-right:has(div:nth-child(8)) > div:nth-child(n+6):has(> div[id^="GPcontrolList-"]) {
    margin: 0;
    padding: 0;
  }

  .position-container-top-right:not(:has(div:nth-child(8))) > div[id^="GPcontrolList-"] {
    margin: 0;
    padding: 0;
  }

  .position-container-top-right:has(div:nth-child(8)) > div:nth-child(n+6)[id^="GPcontrolList-"] {
    padding: 2px;
  }
}

/* TODO: max-height: 779px carto sera plus grande (header et footer réduits) */
/* 6 controls optionnels */
@media (max-height: 919px) {
  .position-container-top-right > .gpf-widget:nth-child(n+9) > button {
    display: none;
  }

  .position-container-top-right:has(.gpf-widget:nth-child(10)) > .gpf-widget:nth-child(n+8) > button {
    display: none;
  }

  .position-container-top-right:not(:has(.gpf-widget:nth-child(10))) > .gpf-widget[id^="GPcontrolList-"] > button {
    display: none;
  }

  .position-container-top-right:has(.gpf-widget:nth-child(10)) > .gpf-widget:nth-child(n+8)[id^="GPcontrolList-"] > button {
    display: inline-flex;
  }

  .position-container-top-right > div:nth-child(n+9) {
    padding: 0;
    margin: 0;
  }

  .position-container-top-right:has(div:nth-child(10)) > div:nth-child(n+8):has(> div[id^="GPcontrolList-"])  {
    padding: 0;
    margin: 0;
  }

  .position-container-top-right:not(:has(div:nth-child(10))) > div[id^="GPcontrolList-"] {
    padding: 0;
    margin: 0;
  }

  .position-container-top-right:has(div:nth-child(10)) > div:nth-child(n+8)[id^="GPcontrolList-"] {
    padding: 2px;
  }
}

/* TODO: max-height: 859px carto sera plus grande (header et footer réduits) */
/* 8 controls optionnels */
@media (max-height: 999px) {
  .position-container-top-right > .gpf-widget:nth-child(n+11) > button {
    display: none;
  }

  .position-container-top-right:has(.gpf-widget:nth-child(12)) > .gpf-widget:nth-child(n+10) > button {
    display: none;
  }

  .position-container-top-right:not(:has(.gpf-widget:nth-child(12))) > .gpf-widget[id^="GPcontrolList-"] > button {
    display: none;
  }

  .position-container-top-right:has(.gpf-widget:nth-child(12)) > .gpf-widget:nth-child(n+10)[id^="GPcontrolList-"] > button {
    display: inline-flex;
  }

  .position-container-top-right > div:nth-child(n+11) {
    padding: 0;
    margin: 0;
  }

  .position-container-top-right:has(div:nth-child(12)) > div:nth-child(n+10):has(> div[id^="GPcontrolList-"])  {
    padding: 0;
    margin: 0;
  }

  .position-container-top-right:not(:has(div:nth-child(12))) > div[id^="GPcontrolList-"] {
    padding: 0;
    margin: 0;
  }

  .position-container-top-right:has(div:nth-child(12)) > div:nth-child(n+10)[id^="GPcontrolList-"] {
    padding: 2px;
  }
}

@media (min-width: 576px) {
  .position-container-bottom-left,
  .position-container-bottom-right,
  .position-container-top-left,
  .position-container-top-right {
    height: calc(100% - 102px);
  }

  .position-container-top-right,
  .position-container-top-left {
    top: 99px;
  }
}
@media (max-width: 576px) {
  .position-container-top-right,
  .position-container-top-left {
    top: 299px;
  }
  .position-container-bottom-left,
  .position-container-bottom-right,
  .position-container-top-left,
  .position-container-top-right {
    height: calc(100% - 303px);
  }

  /* Mode mobile : on positionne les dialog par dessus la barre de recherche
  en position fix, sous le header DSFR, et on annule le positionnement introduit
  par la classe gpf-mobile-fullscree (right ou left) à l'aide de marges */
  .gpf-mobile-fullscreen > button[aria-pressed="true"] ~ dialog {
    margin-top: -250px;
    max-height: calc(100% + 258px);
  }

  .position-container-top-right > .gpf-widget:nth-child(n+3) > button {
    display: none;
  }

  .position-container-bottom-left {
    display: none;
  }

  .ol-scale-line {
    transform: translateX(-50px);
  }
}

@media (max-width: 627px) and (min-width: 576px){
  .position-container-top-right,
  .position-container-top-left {
    top: 164px;
  }
  .position-container-bottom-left,
  .position-container-bottom-right,
  .position-container-top-left,
  .position-container-top-right {
    height: calc(100% - 168px);
  }
}
</style>
