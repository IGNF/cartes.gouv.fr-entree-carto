/**
 * @description
 * Liste des contrôles (widgets)
 *
 * @example
 * {
 *  OverviewMap: {
 *    id: 'OverviewMap',
 *    visible: true,     // visibilité sur la carte / dans le menu
 *    active: false,     // état pour les contrôles togglables qui peuvent être activés ou désactivés
 *    disabled: false,   // interaction autorisée ou non (grisé lorsque true)
 *    icon: "ri:navigation-line" // icône du contrôle
 * }
 */
import { useMatchMedia } from '@/composables/matchMedia';
import { useDataStore } from "@/stores/dataStore";
import { useLogger } from 'vue-logger-plugin';

import { LayerWMTS as GeoportalWMTS } from 'geopf-extensions-openlayers';

let isMobile = useMatchMedia('SM');

/**
 * Liste des contrôles disponibles avec leurs propriétés par défaut
 * Chaque contrôle possède les propriétés suivantes :
 * - id : identifiant unique du contrôle
 * - visible : visibilité sur la carte / dans le menu
 * - active : état pour les contrôles togglables qui peuvent être activés ou désactivés
 * - disabled : interaction autorisée ou non (grisé lorsque true)
 * - icon : icône du contrôle
 * 
 * Attention, l'ordre est important:
 * 1. Catalog
 * 2. LayerSwitcher
 * 3. ControlList
 * 4. Les autres contrôles (ordre non important)
 * 
 * Composable utilisé uniquement dans Controls.vue
 */
export const useControls = {
  Catalog: {
    id: 'Catalog',
    visible: true,
    disabled: false,
    icon: "fr-icon-feedback-line"
  },
  LayerSwitcher: {
    id: 'LayerSwitcher',
    visible: true,
    disabled: false,
    icon: "fr-icon-stack-line"
  },
  MeasureLength: {
    id: 'MeasureLength',
    visible: true,
    disabled: false,
    icon: "ri:ruler-line"
  },
  MeasureArea: {
    id: 'MeasureArea',
    visible: true,
    disabled: false,
    icon: "ri:custom-size"
  },
  Drawing: {
    id: 'Drawing',
    visible: true,
    disabled: false,
    icon: "ri:pencil-line"
  },
  Route: {
    id: 'Route',
    visible: true,
    disabled: false,
    icon: "ri:route-line"
  },
  Isocurve: {
    id: 'Isocurve',
    visible: true,
    disabled: false,
    icon: "ri:map-pin-time-line"
  },
  ReverseGeocode: {
    id: 'ReverseGeocode',
    visible: true,
    disabled: false,
    icon: "ri:signpost-line"
  },
  MousePosition: {
    id: 'MousePosition',
    visible: true,
    disabled: false,
    icon: "gpf:coordonnee"
  },
  ElevationPath: {
    id: 'ElevationPath',
    visible: true,
    disabled: false,
    icon: "ri:line-chart-line"
  },
  MeasureAzimuth: {
    id: 'MeasureAzimuth',
    visible: true,
    disabled: false,
    icon: "ri:compasses-2-line"
  },
  ControlList: {
    id: 'ControlList',
    visible: true,
    disabled: false,
    icon: "ri:list-check"
  },
  OverviewMap: {
    id: 'OverviewMap',
    visible: true,
    active: false,
    disabled: false,
    icon: "ri:navigation-line"
  },
  SearchEngine: {
    id: 'SearchEngine',
    visible: true,
    disabled: false,
    icon: "ri:search-line"
  },
  ScaleLine: {
    id: 'ScaleLine',
    visible: true,
    disabled: false,
    // The ScaleLine control is a non-interactive widget and does not require an icon.
    icon: ""
  },
  GetFeatureInfo: {
    id: 'GetFeatureInfo',
    visible: true,
    disabled: false,
    icon: "gpf:getfeature-line"
  },
  Legends: {
    id: 'Legends',
    visible: true,
    disabled: false,
    icon: "ri:list-indefinite"
  },
  Zoom: {
    id: 'Zoom',
    visible: true,
    active: !isMobile.value,
    disabled: false,
    icon: "ri:zoom-in-line"
  },
  FullScreen: {
    id: 'FullScreen',
    visible: true,
    disabled: false,
    icon: "ri:fullscreen-line"
  },
  Share: {
    id: 'Share',
    visible: true,
    disabled: false,
    icon: "ri:map-2-line"
  },
  Print: {
    id: 'Print',
    visible: true,
    disabled: false,
    icon: "fr-icon-printer-line"
  },
  Territories: {
    id: 'Territories',
    visible: true,
    active: true,
    disabled: false,
    icon: "fr-icon-france-line"
  },
  LayerImport: {
    id: 'LayerImport',
    visible: true,
    disabled: false,
    icon: "ri:file-upload-line"
  },
  ContextMenu: {
    id: 'ContextMenu',
    visible: true,
    disabled: false,
    icon: "ri:menu-2-line"
  },
  Reporting: {
    id: 'Reporting',
    visible: true,
    disabled: false,
    icon: "fr-icon-feedback-line" // ri:feedback-line
  },
  Panoramax: {
    id: 'Panoramax',
    visible: true,
    active: false,
    disabled: false,
    icon: "gpf:panoramax"
  }
}

const controlsById = new Map(Object.values(useControls).map(control => [control.id, control]));

export function isControlVisible(controlId) {
  return controlsById.get(controlId)?.visible !== false;
}

/**
 * Obtenir les contrôles par défaut
 * @returns
 */
export function useDefaultControls() {
  // INFO
  // Filtre les contrôles pour ne garder que ceux qui sont visibles et actifs
  // Actif pour les contrôles togglables !
  return Object.values(useControls)
    .filter(control => control.visible && control.active !== false)
    .map(control => control.id);
}

/**
 * Obtenir les options pour le menu des contrôles
 * (cf. MenuControl.vue)
 * @returns
 */
export function useControlsMenuOptions() {
  return [
    {
      label: 'Mesurer une distance',
      id: 'measureLength',
      name: useControls.MeasureLength.id,
      disabled: useControls.MeasureLength.disabled,
      icon: "ri:ruler-line",
      group: 'Mesure',
    },
    {
      label: 'Mesurer une surface',
      id: 'measureArea',
      name: useControls.MeasureArea.id,
      disabled: useControls.MeasureArea.disabled,
      icon: "ri:custom-size",
      group: 'Mesure',
    },
    {
      label: 'Mesurer un angle',
      id: 'measureAzimuth',
      name: useControls.MeasureAzimuth.id,
      disabled: useControls.MeasureAzimuth.disabled,
      icon: "ri:compasses-2-line",
      group: 'Mesure',
    },
    {
      label: 'Coordonnées du curseur',
      id: 'mousePosition',
      name: useControls.MousePosition.id,
      disabled: useControls.MousePosition.disabled,
      icon: "gpf:coordonnee",
      group: 'Mesure',
    },
    {
      label: 'Profil altimétrique',
      id: 'elevationPath',
      name: useControls.ElevationPath.id,
      hint: 'Afficher l’altitude le long d’un trajet',
      disabled: useControls.ElevationPath.disabled,
      icon: "ri:line-chart-line",
      group: 'Mesure',
    },
    {
      label: 'Annoter la carte',
      id: 'drawing',
      name: useControls.Drawing.id,
      hint: 'Ajouter des points, lignes, formes ou textes directement sur la carte',
      disabled: useControls.Drawing.disabled,
      icon: "ri:pencil-line",
      group: 'Dessin',
    },
    {
      label: 'Itinéraire',
      id: 'route',
      name: useControls.Route.id,
      disabled: useControls.Route.disabled,
      icon: "ri:route-line",
      group: 'Déplacements',
    },
    {
      label: 'Trouver une adresse',
      id: 'reverseGeocode',
      name: useControls.ReverseGeocode.id,
      hint: 'Obtenir l’adresse ou le nom d’un lieu à partir d’un point ou d’une zone sur la carte',
      disabled: useControls.ReverseGeocode.disabled,
      icon: "ri:signpost-line",
      group: 'Déplacements',
    },
    {
      label: 'Zone selon temps de trajet',
      id: 'isocurve',
      name: useControls.Isocurve.id,
      hint: 'Afficher la zone que l’on peut atteindre en un temps donné depuis un point de départ',
      disabled: useControls.Isocurve.disabled,
      icon: "ri:map-pin-time-line",
      group: 'Déplacements',
    },
    {
      label: 'Mini carte',
      id: 'overview',
      name: useControls.OverviewMap.id,
      hint: 'Aperçu de la zone pour se répérer facilement',
      disabled: useControls.OverviewMap.disabled,
      icon: "ri:navigation-line",
      group: 'Affichage',
    },
    {
      label: 'Sélecteur de territoires',
      id: 'territories',
      name: useControls.Territories.id,
      disabled: useControls.Territories.disabled,
      icon: "fr-icon-france-line",
      group: 'Affichage',
    },
    {
      label: 'Zoom',
      id: 'zoom',
      name: useControls.Zoom.id,
      disabled: useControls.Zoom.disabled,
      icon: "ri:zoom-in-line",
      group: 'Affichage',
    },
    {
      label: 'Plein écran',
      id: 'fullscreen',
      name: useControls.FullScreen.id,
      disabled: useControls.FullScreen.disabled,
      icon: "ri:fullscreen-line",
    },
    {
      label: 'Barre de Recherche',
      id: 'searchEngine',
      name: useControls.SearchEngine.id,
      hint: 'Barre de recherche sur la carte',
      disabled: useControls.SearchEngine.disabled,
    },
    {
      label: 'Scale Line',
      id: 'scaleLine',
      name: useControls.ScaleLine.id,
      disabled: useControls.ScaleLine.disabled,
    },
    {
      label: 'Gestionnaire de couches',
      id: 'layerSwitcher',
      name: useControls.LayerSwitcher.id,
      disabled: useControls.LayerSwitcher.disabled,
      icon: "fr-icon-stack-line"
    },
    {
      label: 'GetFeatureInfo',
      id: 'getFeatureInfo',
      name: useControls.GetFeatureInfo.id,
      disabled: useControls.GetFeatureInfo.disabled,
      icon: "gpf:getfeature-line"
    },
    {
      label: 'Légendes',
      id: 'legends',
      name: useControls.Legends.id,
      disabled: useControls.Legends.disabled,
      icon: "ri:list-indefinite"
    },
    {
      label: 'Partager une carte',
      id: 'share',
      name: useControls.Share.id,
      disabled: useControls.Share.disabled,
      icon: "ri:map-2-line"
    },
    {
      label: 'Importer des données',
      id: 'layerImport',
      name: useControls.LayerImport.id,
      disabled: useControls.LayerImport.disabled,
      icon: "ri:file-upload-line"
    },
    {
      label: 'Imprimer une carte',
      id: 'print',
      name: useControls.Print.id,
      disabled: useControls.Print.disabled,
      icon: "fr-icon-printer-line"
    },
    {
      label: 'Liste des controles',
      id: 'controlList',
      name: useControls.ControlList.id,
      disabled: useControls.ControlList.disabled,
      icon: "ri:list-check"
    },
    {
      label: 'Menu contextuel',
      id: 'contextMenu',
      name: useControls.ContextMenu.id,
      disabled: useControls.ContextMenu.disabled,
      icon: "ri:menu-2-line"
    },
    {
      label: 'Signaler une anomalie',
      id: 'reporting',
      name: useControls.Reporting.id,
      disabled: useControls.Reporting.disabled,
      icon: "fr-icon-feedback-line"
    },
    {
      label: 'Catalogue',
      id: 'catalog',
      name: useControls.Catalog.id,
      disabled: useControls.Catalog.disabled,
      icon: "ri:map-2-line"
    },
    {
      label: 'Visionneuse Panoramax',
      id: 'panoramax',
      name: useControls.Panoramax.id,
      disabled: useControls.Panoramax.disabled,
      hint: "Explorez les lieux photographiés et visionnez les photos",
      icon: "gpf:panoramax",
      group: 'Affichage'
    }
  ]
  .filter(opt => Object.keys(useControls).includes(opt.name))
  .filter(opt => controlsById.get(opt.name)?.visible === true)
}

/**
 * Obtenir les positions des contrôles (extensions)
 * @returns 
 */
export function useControlsExtensionPosition() {
  return {
    shareOptions : 'top-left',
    printOptions : 'top-right',
    territoriesOptions : 'bottom-left',
    layerSwitcherOptions : "top-right",
    legendsOptions : "bottom-left",
    getFeatureInfoOptions : 'top-left',
    overviewMapOptions : 'bottom-left',
    zoomOptions : 'bottom-right',
    controlListOptions : 'top-right',
    isocurveOptions : 'top-right',
    routeOptions : 'top-right',
    reverseGeocodeOptions : 'top-right',
    fullscreenOptions : 'bottom-right',
    measureLengthOptions : 'top-right',
    measureAreaOptions : 'top-right',
    measureAzimuthOptions : 'top-right',
    elevationPathOptions : 'top-right',
    layerImportOptions : 'top-left',
    mousePositionOptions : 'top-right',
    drawingOptions : 'top-right',
    reportingOptions : 'top-left',
    catalogOptions : 'top-right',
    panoramaxOptions : 'bottom-left'
  }
}

/**
 * Obtenir la position des contrôles (gauche/droite)  
 * @returns 
 */
export function useControlsPosition() {
  let leftC = []
  let rightC = []
  // Share
  if (useControlsExtensionPosition().shareOptions.includes("left"))
    leftC.push(useControls.Share.id)
  if (useControlsExtensionPosition().shareOptions.includes("right"))
    rightC.push(useControls.Share.id)
  // Print
  if (useControlsExtensionPosition().printOptions.includes("left"))
    leftC.push(useControls.Print.id)
  if (useControlsExtensionPosition().printOptions.includes("right"))
    rightC.push(useControls.Print.id)
  // LayerSwitcher
  if (useControlsExtensionPosition().layerSwitcherOptions.includes("left"))
    leftC.push(useControls.LayerSwitcher.id)
  if (useControlsExtensionPosition().layerSwitcherOptions.includes("right"))
    rightC.push(useControls.LayerSwitcher.id)
  // Legends
  if (useControlsExtensionPosition().legendsOptions.includes("left"))
    leftC.push(useControls.Legends.id)
  if (useControlsExtensionPosition().legendsOptions.includes("right"))
    rightC.push(useControls.Legends.id)
  // Route
  if (useControlsExtensionPosition().routeOptions.includes("left"))
    leftC.push(useControls.Route.id)
  if (useControlsExtensionPosition().routeOptions.includes("right"))
    rightC.push(useControls.Route.id)
  // Isocurve
  if (useControlsExtensionPosition().isocurveOptions.includes("left"))
    leftC.push(useControls.Isocurve.id)
  if (useControlsExtensionPosition().isocurveOptions.includes("right"))
    rightC.push(useControls.Isocurve.id)
  // ReverseGeocode
  if (useControlsExtensionPosition().reverseGeocodeOptions.includes("left"))
    leftC.push(useControls.ReverseGeocode.id)
  if (useControlsExtensionPosition().reverseGeocodeOptions.includes("right"))
    rightC.push(useControls.ReverseGeocode.id)
  // ReverseGeocode
  if (useControlsExtensionPosition().drawingOptions.includes("left"))
    leftC.push(useControls.Drawing.id)
  if (useControlsExtensionPosition().drawingOptions.includes("right"))
    rightC.push(useControls.Drawing.id)
  // GetFeatureInfo
  if (useControlsExtensionPosition().getFeatureInfoOptions.includes("left"))
    leftC.push(useControls.GetFeatureInfo.id)
  if (useControlsExtensionPosition().getFeatureInfoOptions.includes("right"))
    rightC.push(useControls.GetFeatureInfo.id)
  // Territories
  if (useControlsExtensionPosition().territoriesOptions.includes("left"))
    leftC.push(useControls.Territories.id)
  if (useControlsExtensionPosition().territoriesOptions.includes("right"))
    rightC.push(useControls.Territories.id)
  // MeasureLength
  if (useControlsExtensionPosition().measureLengthOptions.includes("left"))
    leftC.push(useControls.MeasureLength.id)
  if (useControlsExtensionPosition().measureLengthOptions.includes("right"))
    rightC.push(useControls.MeasureLength.id)
  // MeasureArea
  if (useControlsExtensionPosition().measureAreaOptions.includes("left"))
    leftC.push(useControls.MeasureArea.id)
  if (useControlsExtensionPosition().measureAreaOptions.includes("right"))
    rightC.push(useControls.MeasureArea.id)
  // MeasureAzimuth
  if (useControlsExtensionPosition().measureAzimuthOptions.includes("left"))
    leftC.push(useControls.MeasureAzimuth.id)
  if (useControlsExtensionPosition().measureAzimuthOptions.includes("right"))
    rightC.push(useControls.MeasureAzimuth.id)
  // MousePosition
  if (useControlsExtensionPosition().mousePositionOptions.includes("left"))
    leftC.push(useControls.MousePosition.id)
  if (useControlsExtensionPosition().mousePositionOptions.includes("right"))
    rightC.push(useControls.MousePosition.id)
  // ElevationPath
  if (useControlsExtensionPosition().elevationPathOptions.includes("left"))
    leftC.push(useControls.ElevationPath.id)
  if (useControlsExtensionPosition().elevationPathOptions.includes("right"))
    rightC.push(useControls.ElevationPath.id)
  // LayerImport
  if (useControlsExtensionPosition().layerImportOptions.includes("left"))
    leftC.push(useControls.LayerImport.id)
  if (useControlsExtensionPosition().layerImportOptions.includes("right"))
    rightC.push(useControls.LayerImport.id)
  // ControlList
  if (useControlsExtensionPosition().controlListOptions.includes("left"))
    leftC.push(useControls.ControlList.id)
  if (useControlsExtensionPosition().controlListOptions.includes("right"))
    rightC.push(useControls.ControlList.id)
  // Signalement
  if (useControlsExtensionPosition().reportingOptions.includes("left"))
    leftC.push(useControls.Reporting.id)
  if (useControlsExtensionPosition().reportingOptions.includes("right"))
    rightC.push(useControls.Reporting.id)
  if (useControlsExtensionPosition().catalogOptions.includes("right"))
    rightC.push(useControls.Catalog.id)
  if (useControlsExtensionPosition().catalogOptions.includes("left"))
    leftC.push(useControls.Catalog.id)
  if (useControlsExtensionPosition().panoramaxOptions.includes("right"))
    rightC.push(useControls.Panoramax.id)
  if (useControlsExtensionPosition().panoramaxOptions.includes("left"))
    leftC.push(useControls.Panoramax.id)
  return {
    left : leftC,
    right : rightC
  }
}

/**
 * Obtenir les options de chaque contrôle
 * @returns 
 */
export function useControlsOptions () {
  const dataStore = useDataStore();
  return {
    catalog: {
      id: "22",
      position: useControlsExtensionPosition().catalogOptions,
      gutter: true,
      listable: false,
      titlePrimary : "Catalogue de cartes",
      layerLabel : "title",
      layerThumbnail : true,
      size : "xl",
      tabHeightAuto : false,
      addToMap : false,
      optimisation : "on-demand",
      search : {
        display : false,
        criteria : ["name","title","description","producer","thematic"]
      },
      categories : [
        {
          title : "Cartes de référence",
          id : "base",
          order : false,
          featured : true,
          filter : {
            field : "base",
            value : "true"
          }
        },
        {
          title : "Toutes les cartes",
          id : "data",
          search : true,
          items : [
            {
              title : "Thème",
              default : true,
              order : true,
              section : true,
              icon : true,
              filter : {
                field : "thematic",
                value : "*"
              }
            },
            {
              title : "Producteur",
              order : true,
              section : true,
              icon : false,
              filter : {
                field : "producer",
                value : "*"
              }
            }
          ]
        },
      ],
      configuration : {
        type : "json",
        data : {
          layers : dataStore.getLayers(),
          topics : dataStore.getTopics(),
          featured : dataStore.getFeatured()
        }
      }
    },
    overviewMap: {
      id: "7",
      collapsed: false,
      position: useControlsExtensionPosition().overviewMapOptions,
      layers : (() => {
        try {
          const log = useLogger();
          const planIgnV2Data = dataStore.getLayerByName("GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", "WMTS");
          if (!planIgnV2Data) {
            log.warn("La couche PLANIGNV2 est introuvable dans le catalogue");
            return [];
          }
          return [
            new GeoportalWMTS({
              layer : "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
              configuration : {
                ...planIgnV2Data,
                params : dataStore.getLayerParamsByName("GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2", "WMTS")
              }
            })
          ];
        } catch (e) {
          const log = useLogger();
          log.warn("Erreur lors de la création de la couche PLANIGNV2 pour l'overviewMap", e);
          return [];
        }
      })()
    },
  };
};
