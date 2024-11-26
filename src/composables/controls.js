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
    disable: false,
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
    if (useControls[control].active === true) {
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
      label: 'Liste des controles',
      id: 'controlList',
      name: useControls.ControlList.id,
      hint: 'Liste des controles supplémentaires non affichés',
      disabled: useControls.ControlList.disable
    }
  ].filter(opt => Object.keys(useControls).includes(opt.name))
  .filter(opt => !opt.disabled)
}
