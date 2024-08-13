/**
 * Liste des contrôles (widgets)
 * @example
 * {
 *  OverviewMap: {
 *    id: 'OverviewMap',
 *    active: true,      // afficher ou non sur la carte
 *    disable: false     // non selectionnable dans le menu : src/components/menu/MenuControl.vue
 * }
 */
export const useControls = {
  OverviewMap: {
    id: 'OverviewMap',
    active: true,
    disable: false
  },
  SearchEngine: {
    id: 'SearchEngine',
    active: true,
    disable: false,
  },
  ScaleLine: {
    id: 'ScaleLine',
    active: true,
    disable: false
  },
  LayerSwitcher: {
    id: 'LayerSwitcher',
    active: true,
    disable: false
  },
  Legends: {
    id: 'Legends',
    active: true,
    disable: false
  },
  Isocurve: {
    id: 'Isocurve',
    active: true,
    disable: false
  },
  ReverseGeocode: {
    id: 'ReverseGeocode',
    active: false,
    disable: false
  },
  Zoom: {
    id: 'Zoom',
    active: true,
    disable: false
  },
  Attributions: {
    id: 'Attributions',
    active: false,
    disable: true
  },
  Rotate: {
    id: 'Rotate',
    active: false,
    disable: true
  },
  Route: {
    id: 'Route',
    active: true,
    disable: false
  },
  FullScreen: {
    id: 'FullScreen',
    active: true,
    disable: false
  },
  MeasureLength: {
    id: 'MeasureLength',
    active: true,
    disable: false
  },
  MeasureArea: {
    id: 'MeasureArea',
    active: true,
    disable: false
  },
  MeasureAzimuth: {
    id: 'MeasureAzimuth',
    active: true,
    disable: false
  },
}

export function getDefaultControls() {
  var defaultControls = [];
  /* récupération des controls par défaut */
  for (var control in useControls) {
    if (useControls[control].active === true) {
      defaultControls.push(useControls[control].id);
    }
  }
  return defaultControls;
}

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
    label: 'Attributions',
    id: 'attributions',
    name: useControls.Attributions.id,
    hint: 'Attributions',
    disabled: useControls.Attributions.disable
  },
  {
    label: 'Rotation de la carte',
    id: 'rotate',
    name: useControls.Rotate.id,
    hint: 'Rotation de la carte',
    disabled: useControls.Rotate.disable
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
].filter(opt => Object.keys(useControls).includes(opt.name))
} 
