/**
 * @description
 * Liste des contrôles (widgets)
 *
 * @example
 * {
 *  OverviewMap: {
 *    id: 'OverviewMap',
 *    active: true,      // rendre actif le widget sur la carte
 *    disable: false     // non selectionnable dans le menu : src/components/menu/MenuControl.vue
 *    analytic: false    // remontée d'interaction pour Eulerian sur le clic du bouton principal
 *    default: true      // actif par défaut sur la carte
 *    icon: "ri:navigation-line" // icône du contrôle
 * }
 */
export const useControls = {
  OverviewMap: {
    id: 'OverviewMap',
    active: false,
    disable: false,
    analytic: true,
    default: false,
    icon: "ri:navigation-line"
  },
  SearchEngine: {
    id: 'SearchEngine',
    active: true,
    disable: true,
    analytic: false,
    default: true,
    icon: "ri:search-line"
  },
  ScaleLine: {
    id: 'ScaleLine',
    active: true,
    disable: true,
    analytic: false,
    default: true,
    // The ScaleLine control is a non-interactive widget and does not require an icon.
    icon: ""
  },
  LayerSwitcher: {
    id: 'LayerSwitcher',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "fr-icon-stack-line"
  },
  GetFeatureInfo: {
    id: 'GetFeatureInfo',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "gpf:getfeature-line"
  },
  Legends: {
    id: 'Legends',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "ri:list-indefinite"
  },
  Drawing: {
    id: 'Drawing',
    active: true,
    disable: false,
    analytic: true,
    default: false,
    icon: "ri:pencil-line"
  },
  Isocurve: {
    id: 'Isocurve',
    active: true,
    disable: false,
    analytic: true,
    default: false,
    icon: "ri:map-pin-time-line"
  },
  ReverseGeocode: {
    id: 'ReverseGeocode',
    active: true,
    disable: false,
    analytic: true,
    default: false,
    icon: "ri:signpost-line"
  },
  Zoom: {
    id: 'Zoom',
    active: true,
    disable: false,
    analytic: false,
    default: true,
    icon: "ri:zoom-in-line"
  },
  Route: {
    id: 'Route',
    active: true,
    disable: false,
    analytic: true,
    default: false,
    icon: "ri:route-line"
  },
  FullScreen: {
    id: 'FullScreen',
    active: true,
    disable: true,
    analytic: false,
    default: true,
    icon: "ri:fullscreen-line"
  },
  MeasureLength: {
    id: 'MeasureLength',
    active: true,
    disable: false,
    analytic: true,
    default: false,
    icon: "fr-icon-ruler-line"
  },
  MeasureArea: {
    id: 'MeasureArea',
    active: true,
    disable: false,
    analytic: true,
    default: false,
    icon: "ri:custom-size"
  },
  MeasureAzimuth: {
    id: 'MeasureAzimuth',
    active: true,
    disable: false,
    analytic: true,
    default: false,
    icon: "fr-icon-compass-3-line"
  },
  Share: {
    id: 'Share',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "ri:map-2-line"
  },
  Print: {
    id: 'Print',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "fr-icon-printer-line"
  },
  MousePosition: {
    id: 'MousePosition',
    active: true,
    disable: false,
    analytic: false,
    default: false,
    icon: "gpf:coordonnee"
  },
  Territories: {
    id: 'Territories',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "fr-icon-france-line"
  },
  ElevationPath: {
    id: 'ElevationPath',
    active: true,
    disable: false,
    analytic: false,
    default: false,
    icon: "ri:line-chart-line"
  },
  LayerImport: {
    id: 'LayerImport',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "ri:file-upload-line"
  },
  ControlList: {
    id: 'ControlList',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "ri:list-check"
  },
  ContextMenu: {
    id: 'ContextMenu',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "ri:menu-2-line"
  },
  Reporting: {
    id: 'Reporting',
    active: true,
    disable: true,
    analytic: true,
    default: true,
    icon: "fr-icon-feedback-line" // ri:feedback-line
  }
}

/**
 * Obtenir les contrôles par défaut
 * @returns
 */
export function useDefaultControls() {
  var defaultControls = [];
  // récupération des controls par défaut
  for (var control in useControls) {
    if (useControls[control].default == true || (useControls[control].active === true && useControls[control].disable === true)) {
      defaultControls.push(useControls[control].id);
    }
  }
  return defaultControls;
}

/**
 * Obtenir les options du menu des contrôles
 * @returns
 */
export function useControlsMenuOptions() {
  return [
    {
      label: 'Barre de Recherche',
      id: 'searchEngine',
      name: useControls.SearchEngine.id,
      hint: 'Barre de recherche sur la carte',
      disabled: useControls.SearchEngine.disable,
      tooltip: ""
    },
    {
      label: 'Mini carte',
      id: 'overview',
      name: useControls.OverviewMap.id,
      hint: 'Petite carte pour se repérer',
      disabled: useControls.OverviewMap.disable,
      tooltip: "Mini Carte pour contextualiser la zone cartographique",
      icon: "ri:navigation-line"
    },
    {
      label: 'Scale Line',
      id: 'scaleLine',
      name: useControls.ScaleLine.id,
      hint: 'Echelle',
      disabled: useControls.ScaleLine.disable,
      tooltip: ""
    },
    {
      label: 'Gestionnaire de couches',
      id: 'layerSwitcher',
      name: useControls.LayerSwitcher.id,
      hint: 'Gestionnaire de couches',
      disabled: useControls.LayerSwitcher.disable,
      tooltip: "",
      icon: "fr-icon-stack-line"
    },
    {
      label: 'GetFeatureInfo',
      id: 'getFeatureInfo',
      name: useControls.GetFeatureInfo.id,
      hint: 'Informations sur les couches',
      disabled: useControls.GetFeatureInfo.disable,
      tooltip: "",
      icon: "gpf:getfeature-line"
    },
    {
      label: 'Légendes',
      id: 'legends',
      name: useControls.Legends.id,
      hint: 'Légendes',
      disabled: useControls.Legends.disable,
      tooltip: "",
      icon: "ri:list-indefinite"
    },
    {
      label: 'Annoter la carte',
      id: 'drawing',
      name: useControls.Drawing.id,
      hint: 'Annoter la carte',
      disabled: useControls.Drawing.disable,
      tooltip: "Ajouter des points, lignes, formes ou textes directement sur la carte",
      icon: "ri:pencil-line",
    },
    {
      label: 'Trouver une adresse',
      id: 'reverseGeocode',
      name: useControls.ReverseGeocode.id,
      hint: 'Geocodage inverse',
      disabled: useControls.ReverseGeocode.disable,
      tooltip: "Obtenir l'adresse ou le nom d'un lieu à partir d'un point ou d'une zone sur la carte",
      icon: "ri:signpost-line"
    },
    {
      label: 'Zone selon temps de trajet',
      id: 'isocurve',
      name: useControls.Isocurve.id,
      hint: 'Calcul d\'isochrone',
      disabled: useControls.Isocurve.disable,
      tooltip: "Afficher la zone que l'on peut atteindre en un temps donné depuis un point de départ",
      icon: "ri:map-pin-time-line"
    },
    {
      label: 'Itinéraire',
      id: 'route',
      name: useControls.Route.id,
      hint: 'Calcul d\'itinéraire',
      disabled: useControls.Route.disable,
      tooltip: "Trouver le meilleur trajet entre deux ou plusieurs points",
      icon: "ri:route-line"
    },
    {
      label: 'Zoom',
      id: 'zoom',
      name: useControls.Zoom.id,
      hint: 'Zoomer - dézoomer',
      disabled: useControls.Zoom.disable,
      tooltip: "Zoomer dézoomer sur la carte",
      icon: "ri:zoom-in-line"
    },
    {
      label: 'Plein écran',
      id: 'fullscreen',
      name: useControls.FullScreen.id,
      hint: 'Plein écran',
      disabled: useControls.FullScreen.disable,
      tooltip: "",
      icon: "ri:fullscreen-line"
    },
    {
      label: 'Mesurer une distance',
      id: 'measureLength',
      name: useControls.MeasureLength.id,
      hint: 'Mesures',
      disabled: useControls.MeasureLength.disable,
      tooltip: "Tracer un trajet pour connaître sa longueur",
      icon: "fr-icon-ruler-line"
    },
    {
      label: 'Mesurer une surface',
      id: 'measureArea',
      name: useControls.MeasureArea.id,
      hint: 'Mesures',
      disabled: useControls.MeasureArea.disable,
      tooltip: "Tracer une zone pour connaître son aire",
      icon: "ri:custom-size"
    },
    {
      label: 'Mesurer un angle',
      id: 'measureAzimuth',
      name: useControls.MeasureAzimuth.id,
      hint: 'Mesures',
      disabled: useControls.MeasureAzimuth.disable,
      tooltip: "Tracer un trait pour connaître l'angle par rapport au Nord",
      icon: "fr-icon-compass-3-line"
    },
    {
      label: 'Partager une carte',
      id: 'share',
      name: useControls.Share.id,
      hint: 'Partages',
      disabled: useControls.Share.disable,
      tooltip: "",
      icon: "ri:map-2-line"
    },
    {
      label: 'Coordonnées du curseur',
      id: 'mousePosition',
      name: useControls.MousePosition.id,
      hint: 'Position de la souris',
      disabled: useControls.MousePosition.disable,
      tooltip: "Voir les coordonnées du curseur",
      icon: "gpf:coordonnee"
    },
    {
      label: 'Selectionner un territoire',
      id: 'territories',
      name: useControls.Territories.id,
      hint: 'Territoires',
      disabled: useControls.Territories.disable,
      tooltip: "",
      icon: "fr-icon-france-line"
    },
    {
      label: 'Courbe d\'altitude le long d\'un trajet',
      id: 'elevationPath',
      name: useControls.ElevationPath.id,
      hint: 'Profil altimétrique',
      disabled: useControls.ElevationPath.disable,
      tooltip: "Afficher le profil altimétrique le long d'un trajet",
      icon: "ri:line-chart-line"
    },
    {
      label: 'Importer des données',
      id: 'layerImport',
      name: useControls.LayerImport.id,
      hint: 'Import de données',
      disabled: useControls.LayerImport.disable,
      tooltip: "",
      icon: "ri:file-upload-line"
    },
    {
      label: 'Imprimer une carte',
      id: 'print',
      name: useControls.Print.id,
      hint: 'Impression',
      disabled: useControls.Print.disable,
      tooltip: "",
      icon: "fr-icon-printer-line"
    },
    {
      label: 'Liste des controles',
      id: 'controlList',
      name: useControls.ControlList.id,
      hint: 'Liste des controles supplémentaires non affichés',
      disabled: useControls.ControlList.disable,
      tooltip: "",
      icon: "ri:list-check"
    },
    {
      label: 'Menu contextuel',
      id: 'contextMenu',
      name: useControls.ContextMenu.id,
      hint: 'Menu contextuel au clic droit sur la carte',
      disabled: useControls.ContextMenu.disable,
      tooltip: "",
      icon: "ri:menu-2-line"
    },
    {
      label: 'Signaler une anomalie',
      id: 'reporting',
      name: useControls.Reporting.id,
      hint: 'Outil de signalement d\'anomalie',
      disabled: useControls.Reporting.disable,
      tooltip: "",
      icon: "fr-icon-feedback-line"
    }
  ].filter(opt => Object.keys(useControls).includes(opt.name))
  .filter(opt => !opt.disabled)
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
    getFeatureInfoOptions : 'bottom-left',
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
    reportingOptions : 'top-left'
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

  return {
    left : leftC,
    right : rightC
  }
}
