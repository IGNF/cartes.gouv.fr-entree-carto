import {
  defineStore
} from 'pinia';

import {
  useStorage
} from '@vueuse/core';

import { getDefaultControls } from '@/composables/controls';

/**
 * Valeurs par defaut
 * pour la liste des contrôles par defaut, on utilise toujours 
 * le composable 'src/composables/controls.js'
 */
var defaultControls = getDefaultControls().toString();

const DEFAULT = {
  LAYERS: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;0)",
  CONTROLS: defaultControls,
  X: 283734.248995,
  Y: 5655117.100650,
  LON: 2.5479878714752027, // informatif
  LAT: 50.800781249995744, // informatif
  ZOOM: 12,
  FIRSTVISIT: false,
  NOINFORMATION: null
}

/**
 * Espace de noms des clefs du localStorage
 */
const NAMESPACE = "cartes.gouv.fr";

const ns = ((value) => {
  return NAMESPACE + '.' + value;
});

/**
 * @description
 * Store des objets de la carte
 * 
 * Les clefs préfixées par "cartes.gouv.fr" 
 * sont les paramètres utilisateurs :
 * 
 * - cartes.gouv.fr.center --> webmercator
 * - cartes.gouv.fr.permalink
 * - cartes.gouv.fr.firstVisit
 * - cartes.gouv.fr.layers
 * - cartes.gouv.fr.zoom	
 * - cartes.gouv.fr.x --> webmercator
 * - cartes.gouv.fr.y --> webmercator
 * - cartes.gouv.fr.lon --> geographic
 * - cartes.gouv.fr.lat --> geographic
 * - cartes.gouv.fr.controls
 * - cartes.gouv.fr.noInformation
 *
 * Construction du permalien :
 * 
 * - La structure des couches
 *   LAYERID(opacity<number>;visible<boolean>;gray<boolean>)<Array>
 *   ex. ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS(1;1;0)
 *    avec caractére de séparation des options de la liste : ';'
 *    et ',' pour chaque couches
 * 
 * - La structure des contrôles
 *   CONTROLID(active<boolean>;disable<boolean>;position<string>)<Array>
 *   ex. Isocurve(1;0;bottom-left)
 *   avec caractére de séparation des options de la liste : ';'
 *   et ',' pour chaque couches
 * 
 * @todo mettre à jour le flag 'firstVisit'
 * @fixme zoom absolu !?
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
  var noInformation = useStorage(ns('noInformation'), DEFAULT.NOINFORMATION);

  //////////////////
  // objets calculés
  //////////////////

  var permalink = computed(() => {
    var url = location;
    return `${url}?c=${center.value}&z=${zoom.value}&l=${layers.value}&w=${controls.value}&permalink=yes`;
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
  watch(noInformation, () => {
    localStorage.setItem(ns('noInformation'), noInformation.value); // number
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
    // INFO
    // on retourne la liste des couches sans les options
    return layers.value.split(",").map(function (l) {
      const regex = /\(.*\)/gm;
      const name = l.replace(regex, "");
      return name;
    }); // array
  }
  function cleanLayers() {
    layers.value = "";
  }
  function addLayer (id) {
    if (!id) {
      return;
    }
    if (getLayers().includes(id)) {
      return;
    }
    var l = layers.value.split(",");
    l.push(id + "(1;1;0)"); // par defaut
    layers.value = l.toString(); // string
  }
  function removeLayer (id) {
    if (!id) {
      return;
    }
    const index = getLayers().indexOf(id);
    if (index !== -1) {
      var l = layers.value.split(",");
      l.splice(index, 1);
      layers.value = l.toString(); // string
    }
  }
  function updateLayerProperty (id, props) {
    const index = getLayers().indexOf(id);
    if (index !== -1) {
      var l = layers.value.split(",");
      // mise à jour des valeurs : opacité, visibilité et couleur
      var strLayer = l[index];
      var strValues = strLayer.substring(strLayer.indexOf("(") + 1, strLayer.indexOf(")"));
      var values = strValues.split(";");
      for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
          const value = props[key];
          if (key === "opacity") {
            values[0] = value;
          }
          if (key === "visible") {
            values[1] = +value; // true -> 1 | false -> 0
          }
          if (key === "gray") {
            values[2] = +value;
          }
        }
      }
      layers.value = layers.value.replace(l[index], id + "(" + values.join(";") + ")"); // string
    }
  }
  function getLayerProperty (id) {
    const index = getLayers().indexOf(id);
    if (index !== -1) {
      var l = layers.value.split(",");
      // extraction des valeurs : opacité, visibilité et couleur
      var strLayer = l[index];
      var strValues = strLayer.substring(strLayer.indexOf("(") + 1, strLayer.indexOf(")"));
      var values = strValues.split(";");
      return {
        opacity : Number(values[0]),
        visible : !!Number(values[1]),
        gray : !!Number(values[2])
      }
    }
  }

  function getControls () {
    // INFO
    // on retourne la liste des widgets sans les options
    return controls.value.split(",").map(function (c) {
      const regex = /\(.*\)/gm;
      const name = c.replace(regex, "");
      return name;
    }); // array
  }
  function cleanControls() {
    controls.value = "";
  }
  function addControl (id) {
    if (getControls().includes(id)) {
      return;
    }
    var c = controls.value.split(",");
    c.push(id + "(1)");
    controls.value = c.toString(); // string
  }
  function removeControl (id) {
    const index = getControls().indexOf(id);
    if (index !== -1) {
      var c = controls.value.split(",");
      c.splice(index, 1);
      controls.value = c.toString(); // string
    }
  }
  function updateControlProperty (id, props) {
    // TODO
  }
  function getControlProperty (id) {
    // TODO
  }

  return {
    map,
    zoom,
    center,
    x,
    y,
    lon,
    lat,
    firstVisit,
    noInformation,
    getMap,
    setMap,
    getLayers,
    cleanLayers,
    addLayer,
    removeLayer,
    updateLayerProperty,
    getLayerProperty,
    getControls,
    cleanControls,
    addControl,
    removeControl,
    updateControlProperty,
    getControlProperty
  }
})