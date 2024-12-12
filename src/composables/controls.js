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
 * }
 */

export const useControls = {
  OverviewMap: {
    id: 'OverviewMap',
    active: true,
    disable: true,
    analytic: true
  },
  SearchEngine: {
    id: 'SearchEngine',
    active: true,
    disable: true,
    analytic: false
  },
  ScaleLine: {
    id: 'ScaleLine',
    active: true,
    disable: true,
    analytic: false
  },
  LayerSwitcher: {
    id: 'LayerSwitcher',
    active: true,
    disable: true,
    analytic: true
  },
  GetFeatureInfo: {
    id: 'GetFeatureInfo',
    active: true,
    disable: true,
    analytic: true
  },
  Legends: {
    id: 'Legends',
    active: true,
    disable: true,
    analytic: true
  },
  Drawing: {
    id: 'Drawing',
    active: true,
    disable: false,
    analytic: true
  },
  Isocurve: {
    id: 'Isocurve',
    active: true,
    disable: false,
    analytic: true
  },
  ReverseGeocode: {
    id: 'ReverseGeocode',
    active: true,
    disable: false,
    analytic: true
  },
  Zoom: {
    id: 'Zoom',
    active: true,
    disable: true,
    analytic: false
  },
  Route: {
    id: 'Route',
    active: true,
    disable: false,
    analytic: true
  },
  FullScreen: {
    id: 'FullScreen',
    active: true,
    disable: true,
    analytic: false
  },
  MeasureLength: {
    id: 'MeasureLength',
    active: true,
    disable: false,
    analytic: true
  },
  MeasureArea: {
    id: 'MeasureArea',
    active: true,
    disable: false,
    analytic: true
  },
  MeasureAzimuth: {
    id: 'MeasureAzimuth',
    active: true,
    disable: false,
    analytic: true
  },
  Share: {
    id: 'Share',
    active: true,
    disable: true,
    analytic: true
  },
  Print: {
    id: 'Print',
    active: true,
    disable: true,
    analytic: true
  },
  MousePosition: {
    id: 'MousePosition',
    active: true,
    disable: false,
    analytic: false
  },
  Territories: {
    id: 'Territories',
    active: true,
    disable: true,
    analytic: true
  },
  ElevationPath: {
    id: 'ElevationPath',
    active: true,
    disable: false,
    analytic: false
  },
  LayerImport: {
    id: 'LayerImport',
    active: true,
    disable: true,
    analytic: true
  },
  ControlList: {
    id: 'ControlList',
    active: true,
    disable: true,
    analytic: true
  },
}

/**
 * Obtenir les contrôles par défaut
 * @returns
 */
export function useDefaultControls() {
  var defaultControls = [];
  // récupération des controls par défaut
  for (var control in useControls) {
    if (useControls[control].active === true && useControls[control].disable === true) {
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
      disabled: useControls.SearchEngine.disable
    },
    {
      label: 'Mini carte',
      id: 'overview',
      name: useControls.OverviewMap.id,
      hint: 'Petite carte pour se repérer',
      disabled: useControls.OverviewMap.disable
    },
    {
      label: 'Scale Line',
      id: 'scaleLine',
      name: useControls.ScaleLine.id,
      hint: 'Echelle',
      disabled: useControls.ScaleLine.disable
    },
    {
      label: 'Gestionnaire de couches',
      id: 'layerSwitcher',
      name: useControls.LayerSwitcher.id,
      hint: 'Gestionnaire de couches',
      disabled: useControls.LayerSwitcher.disable
    },
    {
      label: 'GetFeatureInfo',
      id: 'getFeatureInfo',
      name: useControls.GetFeatureInfo.id,
      hint: 'Informations sur les couches',
      disabled: useControls.GetFeatureInfo.disable
    },
    {
      label: 'Légendes',
      id: 'legends',
      name: useControls.Legends.id,
      hint: 'Légendes',
      disabled: useControls.Legends.disable
    },
    {
      label: 'Croquis',
      id: 'drawing',
      name: useControls.Drawing.id,
      hint: 'Annoter la carte',
      disabled: useControls.Drawing.disable
    },
    {
      label: 'Geocodage inverse',
      id: 'reverseGeocode',
      name: useControls.ReverseGeocode.id,
      hint: 'Geocodage inverse',
      disabled: useControls.ReverseGeocode.disable
    },
    {
      label: 'Calcul d\'isochrone',
      id: 'isocurve',
      name: useControls.Isocurve.id,
      hint: 'Calcul d\'isochrone',
      disabled: useControls.Isocurve.disable
    },
    {
      label: 'Calcul d\'itinéraire',
      id: 'route',
      name: useControls.Route.id,
      hint: 'Calcul d\'itinéraire',
      disabled: useControls.Route.disable
    },
    {
      label: 'Zoom',
      id: 'zoom',
      name: useControls.Zoom.id,
      hint: 'Zoom',
      disabled: useControls.Zoom.disable
    },
    {
      label: 'Plein écran',
      id: 'fullscreen',
      name: useControls.FullScreen.id,
      hint: 'Plein écran',
      disabled: useControls.FullScreen.disable
    },
    {
      label: 'Mesure de distance',
      id: 'measureLength',
      name: useControls.MeasureLength.id,
      hint: 'Mesures',
      disabled: useControls.MeasureLength.disable
    },
    {
      label: 'Mesure d\'aire',
      id: 'measureArea',
      name: useControls.MeasureArea.id,
      hint: 'Mesures',
      disabled: useControls.MeasureArea.disable
    },
    {
      label: 'Mesure d\'azimut',
      id: 'measureAzimuth',
      name: useControls.MeasureAzimuth.id,
      hint: 'Mesures',
      disabled: useControls.MeasureAzimuth.disable
    },
    {
      label: 'Partager une carte',
      id: 'share',
      name: useControls.Share.id,
      hint: 'Partages',
      disabled: useControls.Share.disable
    },
    {
      label: 'Afficher les coordonnées',
      id: 'mousePosition',
      name: useControls.MousePosition.id,
      hint: 'Position de la souris',
      disabled: useControls.MousePosition.disable
    },
    {
      label: 'Selectionner un territoire',
      id: 'territories',
      name: useControls.Territories.id,
      hint: 'Territoires',
      disabled: useControls.Territories.disable
    },
    {
      label: 'Profil altimétrique',
      id: 'elevationPath',
      name: useControls.ElevationPath.id,
      hint: 'Profil altimétrique',
      disabled: useControls.ElevationPath.disable
    },
    {
      label: 'Importer des données',
      id: 'layerImport',
      name: useControls.LayerImport.id,
      hint: 'Import de données',
      disabled: useControls.LayerImport.disable
    },
    {
      label: 'Imprimer une carte',
      id: 'print',
      name: useControls.Print.id,
      hint: 'Impression',
      disabled: useControls.Print.disable
    },
    {
      label: 'Liste des controles',
      id: 'controlList',
      name: useControls.ControlList.id,
      hint: 'Liste des controles supplémentaires non affichés',
      disabled: useControls.ControlList.disable
    }
  ].filter(opt => Object.keys(useControls).includes(opt.name))
  .filter(opt => !opt.disabled)
}

export function useControlsExtensionPosition() {
  return {
    shareOptions : 'top-left',
    printOptions : 'top-right',
    territoriesOptions : 'bottom-left',
    layerSwitcherOptions : "top-right",
    legendsOptions : "top-right",
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
    layerImportOptions : 'top-right',
    mousePositionOptions : 'top-right'
  }
}

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

  return {
    left : leftC,
    right : rightC
  }
}