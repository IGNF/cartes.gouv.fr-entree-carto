import {
  defineStore
} from 'pinia';

import {
  useStorage
} from '@vueuse/core';

/**
 * Valeurs par defaut
 * @fixme pour la liste des contrôles par defaut, on utilise toujours 
 * le composable 'src/composables/controls.js'
 */
const DEFAULT = {
  LAYERS: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS",
  CONTROLS: "",
  X: 283734.248995,
  Y: 5655117.100650,
  LON: 2.5479878714752027, // informatif
  LAT: 50.800781249995744, // informatif
  ZOOM: 12,
  FIRSTVISIT: false
}

/**
 * Espace de noms des clefs du localStorage
 */
const NAMESPACE = "cartes.gouv.fr";

const ns = ((value) => {
  return NAMESPACE + '.' + value;
});

/**
 * Store des objets de la carte
 * 
 * Enregistrement dans le LocalStorage des informations suivantes :
 * cartes.gouv.fr.center --> webmercator
 * cartes.gouv.fr.permalink --> (?)
 * cartes.gouv.fr.firstVisit
 * cartes.gouv.fr.layers
 * cartes.gouv.fr.zoom	
 * cartes.gouv.fr.x --> webmercator
 * cartes.gouv.fr.y --> webmercator
 * cartes.gouv.fr.lon --> geographic
 * cartes.gouv.fr.lat --> geographic
 * cartes.gouv.fr.controls
 *
 * @todo construction du permalien
 * 
 * @todo mettre à jour le flag 'firstVisit'
 * 
 * @todo structure des couches
 *   LAYERID(opacity<number>;(h)idden;(g)ray)<Array>
 *   ex. ORTHOIMAGERY.ORTHOPHOTOS::GEOPORTAIL:OGC:WMTS(1;h;g)
 *   avec caractére de séparation des elements de la liste : ','
 * 
 * @todo structure des contrôles
 *   CONTROLID(active<boolean>;disable<boolean>;position<string>)<Array>
 *   ex. Isocurve(1;0;bottom-left)
 *   avec caractére de séparation des elements de la liste : ','
 * 
 * @fixme zoom absolu ?
 */
export const useMapStore = defineStore('map', () => {
  const map = ref({});

  //////////////////
  // objets simples
  //////////////////

  var zoom = useStorage(ns('zoom'), DEFAULT.ZOOM);
  var x = useStorage(ns('x'), DEFAULT.X);
  var y = useStorage(ns('y'), DEFAULT.Y);
  var lon = useStorage(ns('lon'), DEFAULT.LON);
  var lat = useStorage(ns('lat'), DEFAULT.LAT);
  var firstVisit = useStorage(ns('firstVisit'), DEFAULT.FIRSTVISIT);

  //////////////////
  // objets calculés
  //////////////////

  var permalink = computed(() => {

  });
  var center = computed(() => {
    return [x.value, y.value];
  });

  ////////////////////
  // objets complexes
  ////////////////////

  var layers = useStorage(ns('layers'), DEFAULT.LAYERS);
  if (!layers.value) {
    var l = DEFAULT.LAYERS.split(",").filter(function (l) {
      return !!l;
    });
    for (let i = 0; i < l.length; i++) {
      addLayer(l[i]);
    }
  }
  var controls = useStorage(ns('controls'), DEFAULT.CONTROLS);
  if (!controls.value) {
    var c = DEFAULT.CONTROLS.split(",").filter(function (c) {
      return !!c;
    });
    for (let j = 0; j < c.length; j++) {
      addControl(c[j]);
    }
  }

  ///////////
  // watcher
  ///////////

  watch(zoom, () => {
    localStorage.setItem(ns('zoom'), zoom.value);
  })
  watch(x, () => {
    localStorage.setItem(ns('x'), x.value);
  })
  watch(y, () => {
    localStorage.setItem(ns('y'), y.value);
  })
  watch(lon, () => {
    localStorage.setItem(ns('lon'), lon.value);
  })
  watch(lat, () => {
    localStorage.setItem(ns('lat'), lat.value);
  })
  watch(layers, () => {
    localStorage.setItem(ns('layers'), layers.value.toString()); // string
  })
  watch(permalink, () => {
    localStorage.setItem(ns('permalink'), permalink.value.toString()); // string
  })
  watch(center, () => {
    localStorage.setItem(ns('center'), center.value.toString()); // string
  })
  watch(firstVisit, () => {
    localStorage.setItem(ns('firstVisit'), firstVisit.value); // booleen
  })
  watch(controls, () => {
    localStorage.setItem(ns('controls'), controls.value.toString()); // string
  })

  //////////////////
  // getter/setter
  //////////////////

  function getMap () {
    return map.value;
  }
  function setMap (m) {
    map.value = m;
  }

  function getLayers () {
    return layers.value.split(",").filter(function (l) {
      return !!l;
    }); // array
  }
  function cleanLayers() {
    layers.value = "";
  }
  function addLayer (id) {
    if (getLayers().includes(id)) {
      return;
    }
    var l = getLayers();
    l.push(id);
    layers.value = l.toString(); // string
  }
  function removeLayer (id) {
    const index = getLayers().indexOf(id);
    if (index !== -1) {
      var l = getLayers();
      l.splice(index, 1);
      layers.value = l.toString(); // string
    }
  }

  function getControls () {
    return controls.value.split(",").filter(function (l) {
      return !!l;
    }); // array
  }
  function cleanControls() {
    controls.value = "";
  }
  function addControl (id) {
    if (getControls().includes(id)) {
      return;
    }
    var c = getControls();
    c.push(id);
    controls.value = c.toString(); // string
  }
  function removeControl (id) {
    const index = getControls().indexOf(id);
    if (index !== -1) {
      var c = getControls();
      c.splice(index, 1);
      controls.value = c.toString(); // string
    }
  }

  return {
    map,
    zoom,
    center,
    x,
    y,
    lon,
    lat,
    getMap,
    setMap,
    getLayers,
    cleanLayers,
    addLayer,
    removeLayer,
    getControls,
    cleanControls,
    addControl,
    removeControl
  }
})