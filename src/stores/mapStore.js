import {
  defineStore
} from 'pinia';

import { useStorage } from '@vueuse/core';

import { useUrlParams } from "@/composables/urlParams";
import { useDefaultControls } from '@/composables/controls';

/**
 * Valeurs par defaut
 * pour la liste des contrôles par defaut, on utilise toujours 
 * le composable 'src/composables/controls.js'
 */
var defaultControls = useDefaultControls();

const DEFAULT = {
  LAYERS: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;0)",
  CONTROLS: defaultControls.toString(),
  X: 283734.248995,
  Y:  5655117.100650,
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
 * - cartes.gouv.fr.permalinkShare
 * - cartes.gouv.fr.firstVisit
 * - cartes.gouv.fr.layers
 * - cartes.gouv.fr.zoom -> absolue !
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
 *   (!) pour le moment, on implemente tout simplement une liste des contrôles actifs !
 * 
 * @todo données utilisateurs issues des favoris
 * @todo translation des uuid & 'short' id
 */
export const useMapStore = defineStore('map', () => {
  /////////////
  // objet map
  /////////////
  const map = ref({});

  // gestion des KVP dans l'URL (permalink)
  var params = useUrlParams();
  var defaultControls = DEFAULT.CONTROLS.split(",");
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (key === "controls") {
        var myControls = params[key].split(",");
        defaultControls.forEach(function(defaultControl) {
          if (!myControls.includes(defaultControl)) {
            params[key] = params[key] + "," + defaultControl;
          }
        })
      }
      const value = params[key];
      localStorage.setItem(ns(key), value);
    }
  }

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
    // INFO
    // on exclue la route /embed
    var last = location.pathname.slice(-1);
    var path = (last === "/") ? location.pathname.slice(0, -1) : location.pathname;
    var url = location.origin + path.replace("/embed", "");
    return `${url}?c=${center.value}&z=${Math.round(zoom.value)}&l=${layers.value}&w=${controls.value}&permalink=yes`;
  });

  var permalinkShare = computed(() => {
    // INFO
    // on ajoute la route /embed
    var last = location.pathname.slice(-1);
    var path = (last === "/") ? location.pathname.slice(0, -1) : location.pathname;
    var url = location.origin + (path.includes("/embed") ? path : path + "/embed");
    return `${url}?c=${center.value}&z=${Math.round(zoom.value)}&l=${layers.value}&permalink=yes`;
  });

  var center = computed(() => {
    return [lon.value, lat.value];
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
      var id = l[i].replace(/\(.*\)/, "");
      if (id) {
        addLayer(id); // on veut juste l'ID sans les options !
        // mais, du coup, on perd les options...
      }
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

  localStorage.setItem(ns('center'), center.value);
  localStorage.setItem(ns('permalink'), permalink.value);
  localStorage.setItem(ns('permalinkShare'), permalinkShare.value);

  watch(zoom, () => {
    localStorage.setItem(ns('zoom'), Math.round(zoom.value));
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
  watch(permalinkShare, () => {
    localStorage.setItem(ns('permalinkShare'), permalinkShare.value.toString()); // string
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
    }).filter(name => name != ''); // array
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
    var l = (layers.value === "") ? [] : layers.value.split(",");
    l.push(id + "(1;1;0)"); // options par defaut
    layers.value = l.toString(); // string
  }
  function removeLayer (id) {
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
            values[1] = +value; // cast true -> 1 | false -> 0
          }
          if (key === "gray") {
            values[2] = +value; // cast true -> 1 | false -> 0
          }
        }
      }
      layers.value = layers.value.replace(l[index], id + "(" + values.join(";") + ")"); // string
    }
  }
  function updateLayerPosition (ids) {
    if (!ids) {
      return;
    }
    var l = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const index = getLayers().indexOf(id);
      if (index !== -1) {
        var strLayer = layers.value.split(",")[index];
        l.push(strLayer);
      }
    }
    layers.value = l.join(",");
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
        opacity : Number(values[0]), // cast 
        visible : !!Number(values[1]), // cast 1 -> true | 0 -> false
        gray : !!Number(values[2]) // cast 
      }
    }
  }

  // TODO
  // Gestion des données utilisateurs : favoris
  // > transformation UUID -> 'short' ID dans le permalien !
  function addBookmark (uuid) {}
  function removeBookmark (uuid) {}
  function updateBookmarkProperty (uuid, props) {}
  function updateBookmarkPosition (uuids) {}
  function getBookmarkProperty (uuid) {}

  function getControls () {
    // INFO
    // on retourne la liste des widgets actifs
    return controls.value.split(",").filter(function (c) {
      return !!c;
    }); // array
  }
  function cleanControls() {
    controls.value = "";
  }
  function addControl (id) {
    if (getControls().includes(id)) {
      return;
    }
    var c = (controls.value === "") ? [] : controls.value.split(",");
    c.push(id);
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

  return {
    map,
    layers,
    controls,
    zoom,
    center,
    x,
    y,
    lon,
    lat,
    firstVisit,
    noInformation,
    permalink,
    permalinkShare,
    getMap,
    setMap,
    getLayers,
    cleanLayers,
    addLayer,
    removeLayer,
    updateLayerProperty,
    updateLayerPosition,
    getLayerProperty,
    addBookmark,
    removeBookmark,
    updateBookmarkProperty,
    updateBookmarkPosition,
    getBookmarkProperty,
    getControls,
    cleanControls,
    addControl,
    removeControl
  }
})