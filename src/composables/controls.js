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
    disable: false,
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
    disable: false,
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
  ContextMenu: {
    id: 'ContextMenu',
    active: true,
    disable: true,
    analytic: true
  },
  Reporting: {
    id: 'Reporting',
    active: true,
    disable: true,
    analytic: true
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
      disabled: useControls.SearchEngine.disable,
      tooltip: ""
    },
    {
      label: 'Mini carte',
      id: 'overview',
      name: useControls.OverviewMap.id,
      hint: 'Petite carte pour se repérer',
      disabled: useControls.OverviewMap.disable,
      tooltip: ""
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
      tooltip: ""
    },
    {
      label: 'GetFeatureInfo',
      id: 'getFeatureInfo',
      name: useControls.GetFeatureInfo.id,
      hint: 'Informations sur les couches',
      disabled: useControls.GetFeatureInfo.disable,
      tooltip: ""
    },
    {
      label: 'Légendes',
      id: 'legends',
      name: useControls.Legends.id,
      hint: 'Légendes',
      disabled: useControls.Legends.disable,
      tooltip: ""
    },
    {
      label: 'Annoter la carte',
      id: 'drawing',
      name: useControls.Drawing.id,
      hint: 'Annoter la carte',
      disabled: useControls.Drawing.disable,
      tooltip: "Ajouter des points, lignes, formes ou textes directement sur la carte",
      icon: "ri-pencil-line",
    },
    {
      label: 'Trouver une adresse',
      id: 'reverseGeocode',
      name: useControls.ReverseGeocode.id,
      hint: 'Geocodage inverse',
      disabled: useControls.ReverseGeocode.disable,
      tooltip: "Obtenir l'adresse ou le nom d'un lieu à partir d'un point ou d'une zone sur la carte",
      svg: `<svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.75 1.01001H4.81L3.43 3.06001L2.05 1.01001H0.13L2.36 4.26001L0 7.69001H1.93L3.43 5.45001L4.95 7.69001H6.87L4.51 4.26001L6.75 1.01001Z" fill="currentColor"/>
<path d="M12.7402 1.01L10.9002 5.51L9.07019 1.01H7.2002L10.0102 7.68L9.6402 8.57C9.3602 9.25 8.9502 9.47 8.2902 9.47C8.0002 9.47 7.6802 9.4 7.4702 9.31V10.79C7.7902 10.92 8.15019 11 8.66019 11C9.93019 11 10.6902 10.31 11.1502 9.21L14.5202 1H12.7402V1.01Z" fill="currentColor"/>
<path d="M4.08755 11.018L2.08763 11C2.04303 15.9598 5.68601 20.0927 10.4497 20.8156C10.1859 20.1232 10.0124 19.4016 9.93897 18.6709C6.54684 17.7803 4.05464 14.6778 4.08755 11.018Z" fill="currentColor"/>
<path d="M23.8808 20.02C24.1108 18.88 23.9908 17.7 23.5408 16.63C23.0908 15.56 22.3208 14.64 21.3308 13.99C20.3408 13.34 19.1808 13 18.0008 13C16.8208 13 15.6508 13.34 14.6708 13.99C13.6808 14.64 12.9108 15.55 12.4608 16.63C12.0008 17.7 11.8808 18.88 12.1208 20.02C12.3508 21.16 12.9208 22.21 13.7608 23.03L18.0008 27.18L22.2408 23.03C23.0808 22.21 23.6508 21.16 23.8808 20.02ZM21.9208 19.64C21.7708 20.4 21.3808 21.1 20.8308 21.65L18.0008 24.42L15.1708 21.65C14.6108 21.1 14.2308 20.4 14.0708 19.64C13.9208 18.88 13.9908 18.09 14.3008 17.38C14.6008 16.66 15.1208 16.05 15.7708 15.62C16.4208 15.19 17.2008 14.96 17.9908 14.96C18.7808 14.96 19.5508 15.19 20.2108 15.62C20.8708 16.05 21.3808 16.66 21.6808 17.38C21.9808 18.1 22.0608 18.88 21.9108 19.64H21.9208Z" fill="currentColor"/>
<path d="M18.0008 17.28C17.3508 17.28 16.8308 17.81 16.8308 18.45C16.8308 19.09 17.3608 19.62 18.0008 19.62C18.6408 19.62 19.1708 19.09 19.1708 18.45C19.1708 17.81 18.6408 17.28 18.0008 17.28Z" fill="currentColor"/>
</svg>
`
    },
    {
      label: 'Zone selon temps de trajet',
      id: 'isocurve',
      name: useControls.Isocurve.id,
      hint: 'Calcul d\'isochrone',
      disabled: useControls.Isocurve.disable,
      tooltip: "Afficher la zone que l'on peut atteindre en un temps donné depuis un point de départ",
      svg: `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1174_22932)">
<path d="M8 9.9V15C8 15.55 8.45 16 9 16C9.55 16 10 15.55 10 15V9.9C12.71 9.35 14.45 6.71 13.9 4C13.35 1.3 10.71 -0.450004 8 0.0999962C5.29 0.649996 3.55 3.29 4.1 6C4.5 7.96 6.04 9.5 8 9.9ZM9 2C10.66 2 12 3.34 12 5C12 6.66 10.66 8 9 8C7.34 8 6 6.66 6 5C6 3.34 7.34 2 9 2ZM13.21 12.42C12.66 12.3 12.12 12.66 12 13.21C11.88 13.76 12.24 14.3 12.79 14.42C15.06 14.87 16 15.68 16 16C16 16.58 13.55 18 9 18C4.45 18 2 16.58 2 16C2 15.68 2.94 14.87 5.21 14.38C5.76 14.26 6.12 13.72 6 13.17C5.88 12.62 5.34 12.26 4.79 12.38C1.75 13.08 0 14.39 0 16C0 18.63 4.53 20 9 20C13.47 20 18 18.63 18 16C18 14.39 16.25 13.08 13.21 12.42Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_1174_22932">
<rect width="18" height="20" fill="currentColor"/>
</clipPath>
</defs>
</svg>`
    },
    {
      label: 'Itinéraire',
      id: 'route',
      name: useControls.Route.id,
      hint: 'Calcul d\'itinéraire',
      disabled: useControls.Route.disable,
      tooltip: "Trouver le meilleur trajet entre deux ou plusieurs points",
      svg: `
      <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.69953 4.39903C1.76092 4.39903 1.00002 3.63813 1.00002 2.69951C1.00002 1.7609 1.76092 1 2.69953 1C3.63815 1 4.39905 1.7609 4.39905 2.69951C4.39905 3.63813 3.63815 4.39903 2.69953 4.39903Z" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"/>
<path d="M2.69959 4.95987V10.6278C2.69959 12.2678 4.03371 13.6019 5.67374 13.6019C7.31377 13.6019 8.64789 12.2678 8.64789 10.6278V4.80691C8.64789 3.16688 9.98201 1.83276 11.622 1.83276C13.2621 1.83276 14.5962 3.16688 14.5962 4.80691V10.2029" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
<path d="M12.1924 8.948L14.5959 11.3515" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.5966 11.3514L17 8.94796" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
    },
    {
      label: 'Zoom',
      id: 'zoom',
      name: useControls.Zoom.id,
      hint: 'Zoom',
      disabled: useControls.Zoom.disable,
      tooltip: ""
    },
    {
      label: 'Plein écran',
      id: 'fullscreen',
      name: useControls.FullScreen.id,
      hint: 'Plein écran',
      disabled: useControls.FullScreen.disable,
      tooltip: ""
    },
    {
      label: 'Mesurer une distance',
      id: 'measureLength',
      name: useControls.MeasureLength.id,
      hint: 'Mesures',
      disabled: useControls.MeasureLength.disable,
      tooltip: "Tracer un trajet pour connaître sa longueur",
      svg: `
      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.89379 6.18676C6.69853 6.38202 6.69853 6.6986 6.89379 6.89387C7.08906 7.08913 7.40564 7.08913 7.6009 6.89387L6.89379 6.18676ZM8.30801 4.77255L6.89379 6.18676L7.6009 6.89387L9.01511 5.47965L8.30801 4.77255Z" fill="currentColor"/>
<path d="M8.97357 8.26647C8.7783 8.46173 8.7783 8.77832 8.97357 8.97358C9.16883 9.16884 9.48541 9.16884 9.68067 8.97358L8.97357 8.26647ZM10.3878 6.85226L8.97357 8.26647L9.68067 8.97358L11.0949 7.55936L10.3878 6.85226Z" fill="currentColor"/>
<path d="M11.0533 10.3462C10.858 10.5414 10.858 10.858 11.0533 11.0533C11.2485 11.2486 11.5651 11.2486 11.7604 11.0533L11.0533 10.3462ZM12.4675 8.93197L11.0533 10.3462L11.7604 11.0533L13.1746 9.63908L12.4675 8.93197Z" fill="currentColor"/>
<path d="M13.133 12.4259C12.9377 12.6212 12.9377 12.9377 13.133 13.133C13.3283 13.3283 13.6448 13.3283 13.8401 13.133L13.133 12.4259ZM14.5472 11.0117L13.133 12.4259L13.8401 13.133L15.2543 11.7188L14.5472 11.0117Z" fill="currentColor"/>
<path d="M16.9805 13.4449L15.5663 14.8592" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round"/>
<rect x="5.53552" y="2" width="20" height="5" transform="rotate(45 5.53552 2)" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10"/>
</svg>
`
    },
    {
      label: 'Mesurer une surface',
      id: 'measureArea',
      name: useControls.MeasureArea.id,
      hint: 'Mesures',
      disabled: useControls.MeasureArea.disable,
      tooltip: "Tracer une zone pour connaître son aire",
      svg: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.9922 16.3915C17.6994 16.0987 17.2245 16.0987 16.9316 16.3915C16.6387 16.6844 16.6387 17.1593 16.9316 17.4522L17.9922 16.3915ZM19.4695 19.9901L19.9998 20.5204L21.0605 19.4598L20.5301 18.9294L19.4695 19.9901ZM16.9316 17.4522L19.4695 19.9901L20.5301 18.9294L17.9922 16.3915L16.9316 17.4522Z" fill="currentColor"/>
<path d="M20.5303 19.9902L21.0607 19.4598L20 18.3992L19.4697 18.9295L20.5303 19.9902ZM16.9317 21.4674C16.6388 21.7603 16.6388 22.2352 16.9317 22.5281C17.2246 22.821 17.6995 22.821 17.9924 22.5281L16.9317 21.4674ZM19.4697 18.9295L16.9317 21.4674L17.9924 22.5281L20.5303 19.9902L19.4697 18.9295Z" fill="currentColor"/>
<path d="M1.46967 5.67804C1.17678 5.97094 1.17678 6.44581 1.46967 6.7387C1.76256 7.0316 2.23744 7.0316 2.53033 6.7387L1.46967 5.67804ZM4.73858 4.53045L5.26891 4.00012L4.20825 2.93946L3.67792 3.46979L4.73858 4.53045ZM2.53033 6.7387L4.73858 4.53045L3.67792 3.46979L1.46967 5.67804L2.53033 6.7387Z" fill="currentColor"/>
<path d="M4.73883 3.47059L4.2085 2.94026L3.14784 4.00092L3.67817 4.53125L4.73883 3.47059ZM5.88646 6.73954C6.17935 7.03243 6.65423 7.03243 6.94712 6.73954C7.24001 6.44665 7.24001 5.97177 6.94712 5.67888L5.88646 6.73954ZM3.67817 4.53125L5.88646 6.73954L6.94712 5.67888L4.73883 3.47059L3.67817 4.53125Z" fill="currentColor"/>
<path d="M4.20898 5.10455V16.9843C4.20898 18.3781 5.15458 19.4621 6.37035 19.4621H19.1188" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.6709 12.8356L19.6709 6.06495C19.6709 4.9035 18.8829 4.00015 17.8698 4.00015L10.8355 4.00015" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.3574 11.9835L12.2343 16.0697" stroke="currentColor" stroke-linecap="round"/>
<path d="M16.2773 7.3927L7.52215 16.0695" stroke="currentColor" stroke-linecap="round"/>
<path d="M11.645 7.3136L7.52187 11.3998" stroke="currentColor" stroke-linecap="round"/>
</svg>
`
    },
    {
      label: 'Mesurer un angle',
      id: 'measureAzimuth',
      name: useControls.MeasureAzimuth.id,
      hint: 'Mesures',
      disabled: useControls.MeasureAzimuth.disable,
      tooltip: "Tracer un trait pour connaître l'angle par rapport au Nord",
      svg: `
      <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1174_22921)">
<path d="M18.97 10.18C18.61 10.18 18.33 10.03 18.11 9.74C17.89 9.45 17.78 9.02 17.78 8.47C17.78 7.87 17.88 7.31 18.09 6.77C18.29 6.24 18.57 5.76 18.92 5.35C19.27 4.93 19.65 4.61 20.08 4.38C20.51 4.15 20.95 4.03 21.4 4.03C21.63 4.03 21.84 4.06 22.04 4.11C22.24 4.17 22.42 4.24 22.57 4.34L23.15 4.08H23.44L22.66 8.45C22.59 8.88 22.66 9.1 22.88 9.1C23.01 9.1 23.15 9.03 23.31 8.88C23.47 8.73 23.62 8.49 23.78 8.15L23.99 8.23C23.5 9.54 22.89 10.19 22.13 10.19C21.76 10.19 21.49 10.06 21.32 9.8C21.15 9.54 21.1 9.17 21.17 8.68H21.14C20.78 9.18 20.43 9.56 20.09 9.81C19.75 10.06 19.38 10.19 18.98 10.19L18.97 10.18ZM19.28 7.81C19.28 8.24 19.32 8.56 19.41 8.77C19.5 8.98 19.66 9.08 19.9 9.08C20.14 9.08 20.38 8.97 20.61 8.75C20.84 8.53 21.06 8.28 21.25 8L21.78 5C21.67 4.86 21.55 4.75 21.42 4.68C21.29 4.61 21.13 4.57 20.95 4.57C20.61 4.57 20.32 4.72 20.07 5.03C19.82 5.34 19.62 5.74 19.49 6.23C19.35 6.72 19.28 7.25 19.28 7.8V7.81Z" fill="currentColor"/>
<path d="M20.9 15.72H15.38C15.31 12.48 13.87 9.57 11.61 7.55L17.06 1.32L15.55 0L9.99999 6.35C8.26999 5.28 6.24999 4.66 4.07999 4.66H3.07999V6.66H4.07999C5.74999 6.66 7.30999 7.11 8.66999 7.88L5.05999 12.01C4.74999 11.93 4.41999 11.88 4.07999 11.88C1.82999 11.88 -0.0100098 13.71 -0.0100098 15.97C-0.0100098 18.23 1.81999 20.06 4.07999 20.06C5.69999 20.06 7.09999 19.1 7.75999 17.73H20.9V15.73V15.72ZM10.3 9.05C12.14 10.7 13.31 13.07 13.38 15.71H8.14999C8.07999 14.63 7.60999 13.67 6.86999 12.98L10.31 9.05H10.3ZM4.08999 18.05C2.93999 18.05 1.99999 17.11 1.99999 15.96C1.99999 14.81 2.93999 13.87 4.08999 13.87C5.23999 13.87 6.17999 14.81 6.17999 15.96C6.17999 17.11 5.23999 18.05 4.08999 18.05Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_1174_22921">
<rect width="23.98" height="20.05" fill="currentColor"/>
</clipPath>
</defs>
</svg>

`
    },
    {
      label: 'Partager une carte',
      id: 'share',
      name: useControls.Share.id,
      hint: 'Partages',
      disabled: useControls.Share.disable,
      tooltip: ""
    },
    {
      label: 'Coordonnées du curseur',
      id: 'mousePosition',
      name: useControls.MousePosition.id,
      hint: 'Position de la souris',
      disabled: useControls.MousePosition.disable,
      tooltip: "Voir les coordonnées du curseur",
      svg: `
      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.39995 15.33V2.43L12.09 4.78V11.83H14.08V4.72L18 3.04V3.23H17.99V11.83H19.99V0.76C19.99 0.68 19.98 0.6 19.94 0.52C19.9 0.45 19.84 0.38 19.77 0.34C19.7 0.3 19.62 0.27 19.54 0.26C19.46 0.26 19.37 0.26 19.3 0.3L13 3L7.00995 0L0.00995442 3V19.61C-4.55808e-05 19.69 0.00995442 19.77 0.0599544 19.85C0.0999544 19.92 0.159954 19.99 0.219954 20.03C0.279954 20.07 0.369954 20.1 0.449954 20.11C0.529954 20.11 0.619954 20.11 0.689954 20.07L6.98995 17.37L7.38995 17.19V15.33H7.39995ZM5.40995 15.87L1.99995 17.33V17.14H2.00995V4.32L5.40995 2.86V15.87Z" fill="currentColor"/>
<path d="M21.4222 18.5953L13.6339 13.0711C13.3622 12.8899 13 13.0711 13 13.4333L13.9056 22.9422C13.9056 23.3044 14.449 23.395 14.6301 23.1233L16.0791 20.5876L17.528 23.1233C17.7092 23.4855 18.162 23.6667 18.5242 23.6667C18.7053 23.6667 18.8865 23.5761 19.0676 23.4855C19.6109 23.1233 19.7921 22.4894 19.5204 21.946L18.0714 19.4103H21.0599C21.5127 19.3197 21.6938 18.8669 21.4222 18.5953Z" fill="currentColor"/>
</svg>
`
    },
    {
      label: 'Selectionner un territoire',
      id: 'territories',
      name: useControls.Territories.id,
      hint: 'Territoires',
      disabled: useControls.Territories.disable,
      tooltip: ""
    },
    {
      label: 'Courbe d\'altitude le long d\'un trajet',
      id: 'elevationPath',
      name: useControls.ElevationPath.id,
      hint: 'Profil altimétrique',
      disabled: useControls.ElevationPath.disable,
      tooltip: "Afficher le profil altimétrique le long d'un trajet",
      svg: `
      <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1174_22927)">
<path d="M13.74 19.83H2.52998L7.82998 8.6L11.68 15.67L13.4 14.73L10.24 8.92L12.98 3.19L17.34 11.78C17.92 11.48 18.55 11.27 19.22 11.14L13.83 0.54C13.66 0.21 13.31 0.02 12.94 0C12.57 0 12.23 0.22 12.07 0.56L9.08998 6.8L8.63998 5.97C8.45998 5.65 8.10998 5.46 7.74998 5.46C7.37998 5.47 7.04998 5.69 6.88998 6.02L0.0899829 20.39C-0.0500171 20.69 -0.0300171 21.05 0.149983 21.33C0.329983 21.61 0.639983 21.79 0.979983 21.79H14.6C14.22 21.19 13.93 20.53 13.74 19.83Z" fill="currentColor"/>
<path d="M16.48 13.69V15.23H21.39L15.83 20.78L15.76 20.85L16.84 21.94L22.47 16.31V21.22H24V13.69H16.48Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_1174_22927">
<rect width="24" height="21.94" fill="currentColor"/>
</clipPath>
</defs>
</svg>`
    },
    {
      label: 'Importer des données',
      id: 'layerImport',
      name: useControls.LayerImport.id,
      hint: 'Import de données',
      disabled: useControls.LayerImport.disable,
      tooltip: ""
    },
    {
      label: 'Imprimer une carte',
      id: 'print',
      name: useControls.Print.id,
      hint: 'Impression',
      disabled: useControls.Print.disable,
      tooltip: ""
    },
    {
      label: 'Liste des controles',
      id: 'controlList',
      name: useControls.ControlList.id,
      hint: 'Liste des controles supplémentaires non affichés',
      disabled: useControls.ControlList.disable,
      tooltip: ""
    },
    {
      label: 'Menu contextuel',
      id: 'contextMenu',
      name: useControls.ContextMenu.id,
      hint: 'Menu contextuel au clic droit sur la carte',
      disabled: useControls.ContextMenu.disable,
      tooltip: ""
    },
    {
      label: 'Signaler une anomalie',
      id: 'reporting',
      name: useControls.Reporting.id,
      hint: 'Outil de signalement d\'anomalie',
      disabled: useControls.Reporting.disable,
      tooltip: ""
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
