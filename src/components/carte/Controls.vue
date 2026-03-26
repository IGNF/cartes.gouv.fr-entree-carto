<script lang="js">
  /**
   * @description
   * Composant de gestion des contrôles de la carte
   *
   * @property { Array } controlOptions tableau contenant les controls disponibles
   * @property { String } mapId identifiant de la carte
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
import CatalogManager from './control/CatalogManager.vue';

import { useDomStore } from '@/stores/domStore';
import { useMapStore } from "@/stores/mapStore";
import { useControls, useControlsExtensionPosition } from '@/composables/controls';
import { useLogger } from 'vue-logger-plugin';

import IconGeolocationSVG from "../../assets/geolocation.svg";

import { LoggerUtils } from 'geopf-extensions-openlayers';

const emitter = inject('emitter');

const isProduction = (import.meta.env.MODE === "production");
if (isProduction) {
  LoggerUtils.disableAll();
} else {
  LoggerUtils.enableAll();
  // Orienté maintenance et débogage !
  // Expose LoggerUtils sur window pour le débogage en console
  window.LoggerUtils = LoggerUtils;
}

const props = defineProps({
  controlOptions: {
    type: Array,
    default: () => []
  },
  mapId: {
    type: String,
    default: ''
  }
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
const log = useLogger();
log.debug(props.controlOptions);


// liste des options pour les contrôles
const searchEngineOptions = {
  id: "1",
  collapsed: false,
  collapsible: false,
  returnTrueGeometry: true,
  autocompleteOptions : {
    serviceOptions : {
        maximumResponses : 10
    },
    prettifyResults : true,
    maximumEntries : 5
  },
  markerUrl : IconGeolocationSVG,
  placeholder: "Rechercher un lieu...",
};

const layerSwitcherOptions = {
  options: {
    id: "2",
    position : useControlsExtensionPosition().layerSwitcherOptions,
    collapsed: true,
    gutter: true,
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
  view : {
    active : true,
    title : "Modifier les territoires",
    description : "Modifier la vue"
  }
};

// actif par défaut
const getFeatureInfoOptions = {
  id: "6",
  position: useControlsExtensionPosition().getFeatureInfoOptions,
  noDataMessage : "<h6 style='text-align: center;'> Pas d'infos disponibles </h6> <p style='text-align: center;'> Il n'y a pas de données interrogeables ici </p>"
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
  prettifyCompute: true,
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
  editCoordinates : true,
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
  gutter: true,
  listable: true,
};

const reportingOptions = {
  id: "21",
  position: useControlsExtensionPosition().reportingOptions,
  gutter: true,
  listable: true,
  format : "kml"
};

const contextMenuOptions = computed(() => {
  return {
    contextMenuItemsOptions : [
      {
        text : "Signaler une anomalie",
        callback : () => {
          setTimeout(() => {
            // envoi d'un evenement pour l'ouverture du contrôle
            emitter.dispatchEvent("modalreporting:open:clicked", {
              open : true,
              componentName: "ModalReportingStart"
            });
            // envoi d'un evenement pour la fermeture du menu de gauche
            emitter.dispatchEvent("leftmenu:close", {
              open : false,
              componentName: "ContextMenu"
            });
          }, 0);
        }
      }
    ]
  }
})

onMounted(() => {
  log.debug("Controls component mounted")
  domStore.setleftControlMenu(document.getElementById("position-container-bottom-left"));
  domStore.setrightControlMenu(document.getElementById("position-container-top-right"));
})
</script>
<!-- INFO : Affichage du contrôle
>>> option visibility:true, si le contrôle est dans la liste
>>> sinon, visibility:false
-->
<template>
  <CatalogManager
    :visibility="true"
    :analytic="false"
    :map-id="mapId"
  />
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

<style lang="scss">
@use "@/assets/variables" as *;

// positionnement des conteneurs de widgets
.ol-overlaycontainer-stopevent {
  // evite de creer un stacking context (ce qui complexifie la superposition des menuwrapper)
  z-index: initial !important;
}
.position {
  z-index: 1;
  width: $widget-btn-size;
  height: calc(100% - $gap * 2);
  gap: $gap;
}
.position-container-top-left {
  top: $gap;
  left: $gap;
}
.position-container-top-right {
  top: $gap;
  right: $gap;
  // cree un containing block
  will-change: transform;
}
.position-container-bottom-left {
  bottom: $gap;
  left: $gap;
}
.position-container-bottom-right {
  z-index: 0;
  bottom: $gap;
  right: $gap;
}
@include max(sm) {
  .position {
    height: calc(100% - ($widget-btn-size + $gap * 3));
  }
  .position-container-top-left,
  .position-container-top-right {
    top: $widget-btn-size + $gap * 2;
  }
}
.gpf-widget-button {
  width: $widget-btn-size;
  padding: 0;
  box-shadow: var(--raised-shadow);
  border-radius: $widget-btn-radius;

  & > .gpf-btn-icon {
    width: $widget-btn-size;
    height: $widget-btn-size;
    padding: $widget-btn-padding;
    // supprime l'ombre
    filter: none;
    // cree l'effet du bouton
    @include widget-btn-style;
    // surclasse dsfr
    max-width: initial !important;
    max-height: initial !important;
  }
  &.gpf-button-no-gutter > .gpf-btn-icon {
    @include widget-btn-no-gutter-style;
  }
  & > .gpf-btn-icon:not(:disabled):hover {
    @include widget-btn-style-hover;
  }
  & > .gpf-btn-icon[aria-pressed="true"],
  & > .gpf-btn-icon[aria-pressed="true"]:not(:disabled):hover {
    @include widget-btn-style-active;
  }
  // supprime les traits active
  &:has(> .gpf-btn-icon[aria-pressed="true"])::after {
    content: none;
  }
}
// conteneur top-right
.position-container-top-right {
  // cree un espace vide au-dessus du 3e widget (pour insérer le controleur de widgets)
  .gpf-widget-button:nth-child(3) {
    margin-top: $widget-btn-size;
  }
  // enleve le border-radius (en haut)
  .gpf-widget-button:nth-child(3) .gpf-btn-icon {
    border-radius: 0;
  }
}
// tooltips: position
.position-container-top-right > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before,
.position-container-bottom-right > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before {
  transform: translate(-100%, $widget-btn-padding);
}
.position-container-top-left > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before,
.position-container-bottom-left > .gpf-widget-button > .gpf-btn-icon[aria-label]:hover::before {
  transform: translate($widget-btn-size - $widget-btn-padding * 2, $widget-btn-padding);
}
// modales: au dessus quand active
.position:has(> .gpf-widget-button > .gpf-btn-icon[aria-pressed="true"]) {
  z-index: 2;

  // au dessus de tout en mobile
  @include max(sm) {
    z-index: 4;
  }
}
// tooltips: au-dessus quand hover
.position:has(> .gpf-widget-button > .gpf-btn-icon[aria-label]:hover) {
  z-index: 3;
}
// supprime tooltip si deja ouverte
.position > .gpf-widget-button > .gpf-btn-icon[aria-pressed="true"]:hover::before {
  content: none;
}
// alignements en hauteur des bouton no-gutter
.position-container-top-left .gpf-button-no-gutter,
.position-container-top-right .gpf-button-no-gutter {
  margin-bottom: -$gap;
}
// panels
.gpf-panel {
  position: absolute;
  top: 0 !important; // aligne par rapport a .position
  @include widget-panel-sizes;
  box-shadow: var(--raised-shadow);
}
.position-container-top-left .gpf-panel,
.position-container-bottom-left .gpf-panel {
  left: $widget-btn-size + $gap !important;
}
.position-container-top-right .gpf-panel,
.position-container-bottom-right .gpf-panel {
  right: $widget-btn-size + $gap !important;
}
.gpf-panel__body {
  max-height: calc(70vh) !important;
  max-height: calc(100cqb - $gap * 2) !important;
}
.gpf-panel__body_ls {
  max-height: initial !important;
}
.gpf-panel__content {
  overflow: auto;
}
@include max(sm) {
  .gpf-panel {
    max-width: 100vw !important;
    max-height: 100cqb !important;
  }
  .gpf-panel__body {
    max-height: 100cqb !important;
  }
  // selecteur a rallonge obligatoire pour surclasser le style
  .position .gpf-widget-button > button[aria-pressed] ~ dialog.gpf-panel {
    min-width: 0;
    right: -$gap !important;
    top: -($widget-btn-size + $gap * 2) !important; // au-dessus de la recherche
    width: 100vw !important;
  }
  :is(.position-container-top-left, .position-container-bottom-left) .gpf-widget-button > button[aria-pressed] ~ dialog.gpf-panel {
    right: auto !important;
    left: -$gap !important;
  }
}

/**
 *  gestion du nombre de widget en fonction de la hauteur
 */

// le widget GPcontrolList est caché par défaut (pas d'outils)
.gpf-widget[id^="GPcontrolList-"] {
  display: none;
}
// puis réaffiché si minimum 1 outil (n=3, apres catalog+layerswitcher)
.position-container-top-right > .gpf-widget-button:nth-child(3) ~ .gpf-widget-button[id^="GPcontrolList-"] {
  position: absolute !important;
  display: block;
  // le controlList est affiché tout en bas, sous la liste
  // --diff-widgets
  // si le nombre max (--nb-widgets) est plus grand que le nombre de widget (--count +1 car controlList)
  // alors, --diff-widgets > 0 et bottom = 9999px * n, sinon --diff-widgets = 0 et bottom = 0
  --diff-widgets: max(var(--nb-widgets) - var(--count) + 1, 0);
  bottom: calc(var(--diff-widgets) * 9999px) !important;
}

// on ajoute un border-radius sur l'avant dernier élément, a partir du 3e (celui avant controlList)
.position-container-top-right > .gpf-widget-button:nth-child(2) ~ .gpf-widget-button:nth-last-child(2) > .gpf-btn-icon {
  border-radius: 0 0 $widget-btn-radius $widget-btn-radius;
}

// on calcule la hauteur qui dépend du nombre d'outil (le minimum entre le nombre reel (count) et le nombre max (nb-widgets))
.position-container-top-right {
  --nb-widgets: 0;
  position: relative;
  height: calc((min(var(--count), var(--nb-widgets)) * $widget-btn-size) + ($widget-btn-size * 4) + ($gap * 2));
}

// on défini le nombre de widgets max en fonction de la hauteur de map
@container map (min-height: 500px) { .position-container-top-right { --nb-widgets: 0 } }
@container map (min-height: 550px) { .position-container-top-right { --nb-widgets: 2 } }
@container map (min-height: 600px) { .position-container-top-right { --nb-widgets: 3 } }
@container map (min-height: 650px) { .position-container-top-right { --nb-widgets: 4 } }
@container map (min-height: 700px) { .position-container-top-right { --nb-widgets: 5 } }
@container map (min-height: 750px) { .position-container-top-right { --nb-widgets: 6 } }
@container map (min-height: 850px) { .position-container-top-right { --nb-widgets: 8 } }
@container map (min-height: 900px) { .position-container-top-right { --nb-widgets: 10 } }
@container map (min-height: 950px) { .position-container-top-right { --nb-widgets: 20 } }

// creation des selecteurs pour 20 outils
@for $i from 1 through 20 {
  // defini la position du widget (i) (n=3 est le premier widget)
  .position-container-top-right > .gpf-widget-button:nth-child(#{$i + 2}) { --i: #{$i} }
  // defini le nombre total de widgets (count) (n=4 car controllist ne compte pas)
  .position-container-top-right:has(> .gpf-widget-button:nth-child(#{$i + 3})) { --count: #{$i} }
}

// on décale tous les widgets qui dépassent de la hauteur (pour les masquer)
.position-container-top-right > .gpf-widget-button:not([id^="GPcontrolList-"]) {
  margin-left: calc(max(var(--i) - var(--nb-widgets), 0) * 2in);
}
</style>
