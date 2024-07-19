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
    active: false,
    disable: true
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
