import { inject } from 'vue';
import {
  defineStore
} from 'pinia';

import { useStorage } from '@vueuse/core';

import { useUrlParams } from "@/composables/urlParams";
import { useDefaultControls } from '@/composables/controls';

// FIXME
// comment reduire la taille de la chaine de caractères dans l'url ?
// import { decode, encode } from "universal-base64url";

/**
 * Valeurs par defaut
 * pour la liste des contrôles par defaut, on utilise toujours 
 * le composable 'src/composables/controls.js'
 */
var defaultControls = useDefaultControls();

const DEFAULT = {
  LAYERS: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;1;0)",
  CONTROLS: defaultControls.toString(),
  X: 289739.8968702704,
  Y: 5859851.607344459,
  LON: 2.602777, // informatif
  LAT: 46.493888, // informatif
  ZOOM: 6,
  FIRSTVISIT: false
}

/**
 * Espace de noms des clefs du sessionStorage
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
 * - cartes.gouv.fr.bookmarks
 * - cartes.gouv.fr.zoom -> absolue !
 * - cartes.gouv.fr.x --> webmercator
 * - cartes.gouv.fr.y --> webmercator
 * - cartes.gouv.fr.lon --> geographic
 * - cartes.gouv.fr.lat --> geographic
 * - cartes.gouv.fr.controls
 * - cartes.gouv.fr.location
 *
 * Construction du permalien :
 * 
 * - La structure des couches
 *   LAYERID(position<number>;opacity<number>;visible<boolean>;grayscale<boolean>)<Array>
 *   ex. ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS(4;1;1;0)
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
 * - La structure d'un favoris par URL de partage
 *   ex. https://data.geopf.fr/documents/1p2pDnXdwZfaCfsAkriU9UJBLO9vuKxb8M7Fna7iDrx4s1.bin?
 *    uuid=bb2903e4-4bee-4322-9fcf-de9a0d983490&
 *    name=Mon+croquis&
 *    description=export&
 *    format=kml&
 *    position=0&
 *    opacity=1&
 *    visible=1&
 *    grayscale=0
 * 
 */
export const useMapStore = defineStore('map', () => {
  const emitter = inject('emitter');

  /////////////
  // objet map
  /////////////
  const map = ref({});

  // gestion des KVP dans l'URL (permalink)
  try {
    var params = useUrlParams();
    var defaultControls = DEFAULT.CONTROLS.split(",");
    const type = params.permalink;
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        // on ne traite pas cette clef dans le sessionStorage
        if (key === "permalink") {
          continue;
        }
        if (key === "controls") {
          var myControls = params[key].split(",");
          defaultControls.forEach(function(defaultControl) {
            if (!myControls.includes(defaultControl)) {
              params[key] = params[key] + "," + defaultControl;
            }
          })
        }
        var value = params[key];
        if (key === "layers") {
          // 2 cas :
          // - permalink = yes : remplace la conf
          // - permalink = no  : complete la conf
          if (type === "no") {
            // on modifier la position des nouvelles couches
            // à ajouter pour qu'elle soit toujours au dessus
            var newValue = "";
            var curLyr = sessionStorage.getItem(ns(key));
            var posLyr = curLyr.split(",").length + 1;
            var newsLyr = value.split(",");
            for (let i = 0; i < newsLyr.length; i++) {
              const lyr = newsLyr[i];
              var id = lyr.substring(0, lyr.indexOf("("));
              var opts = lyr.substring(lyr.indexOf("(") + 1, lyr.indexOf(")"));
              var props = opts.split(";");
              props[0] = posLyr + i;
              var newVal = id + "(" + props.join(";") + ")";
              curLyr = curLyr.concat(",", newVal);
            }
            value = curLyr;
          }
        }
        sessionStorage.setItem(ns(key), value);
      }
    }
  } catch (error) {
    // INFO
    // si le permalien est mal formaté, une exception est renvoyée
    // et on ne le prend pas en compte afin de ne pas casser le sessionStorage
    // le message reste en mode silencieux, pas de notfication...
    console.error(error);
  }

  // HACK
  // gestion de la geolocalisation à la lecture du permalien
  setTimeout(() => {
    if (sessionStorage.getItem(ns('geolocation')) !== "") {
      var coordinates = sessionStorage.getItem(ns('geolocation')).split(",");
      // envoi d'un evenement pour afficher la geolocalisation
      emitter.dispatchEvent("searchengine:open:displayed", {
        position : coordinates
      });
    }
  }
  , 100);

  //////////////////
  // objets simples
  //////////////////

  var zoom = useStorage(ns('zoom'), DEFAULT.ZOOM, sessionStorage);
  var x = useStorage(ns('x'), DEFAULT.X, sessionStorage);
  var y = useStorage(ns('y'), DEFAULT.Y, sessionStorage);
  var lon = useStorage(ns('lon'), DEFAULT.LON, sessionStorage);
  var lat = useStorage(ns('lat'), DEFAULT.LAT, sessionStorage);
  var firstVisit = useStorage(ns('firstVisit'), DEFAULT.FIRSTVISIT, sessionStorage);
  var geolocation = useStorage(ns('geolocation'), "", sessionStorage);
  
  // INFO
  // cette valeur devrait toujours être reinitilisée à false
  sessionStorage.setItem(ns('noLoginInformation'), false);
  var noLoginInformation = useStorage(ns('noLoginInformation'), false, sessionStorage);

  //////////////////
  // objets calculés
  //////////////////

  var isPermalink = computed(() => {
    return (location.search.includes("permalink=yes"));
  });
  
  var permalink = computed(() => {
    // INFO
    // on exclue la route /embed
    var permalinkUrl = "";
    var optionalControls = controls.value.split(",").filter((c) => !defaultControls.includes(c)).toString();
    var last = location.pathname.slice(-1);
    var path = (last === "/") ? location.pathname.slice(0, -1) : location.pathname;
    var url = location.origin + path.replace("/embed", "");
    permalinkUrl = `${url}?c=${center.value}&z=${Math.round(zoom.value)}`;
    if (geolocation.value !== "") {
      permalinkUrl += `&p=${geolocation.value}`;
    }
    permalinkUrl += (bookmarks.value.length > 0) ? 
    `&l=${layers.value}&w=${optionalControls}&d=${bookmarks.value.replace(/%26s%3D1/g, "")}` :
    `&l=${layers.value}&w=${optionalControls}`;
    return permalinkUrl + "&permalink=yes";
  });

  var permalinkShare = computed(() => {
    // INFO
    // on ajoute la route /embed
    var permalinkShareUrl = "";
    var last = location.pathname.slice(-1);
    var path = (last === "/") ? location.pathname.slice(0, -1) : location.pathname;
    var url = location.origin + (path.includes("/embed") ? path : path + "/embed");
    permalinkShareUrl = `${url}?c=${center.value}&z=${Math.round(zoom.value)}`;
    if (geolocation.value !== "") {
      permalinkShareUrl += `&p=${geolocation.value}`;
    }
    permalinkShareUrl += (bookmarks.value.length > 0) ? 
    `&l=${layers.value}&d=${bookmarks.value.replace(/%26s%3D1/g, "")}` :
    `&l=${layers.value}`;
    return permalinkShareUrl + "&permalinkShare=yes";
  });

  var center = computed(() => {
    return [lon.value.toFixed(6), lat.value.toFixed(6)];
  });

  ////////////////////
  // objets complexes
  ////////////////////

  /**
   * @type {*}
   * @description
   * La liste des couches
   * ex. ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS(1;1;0)
   */
  var layers = useStorage(ns('layers'), DEFAULT.LAYERS, sessionStorage);
  if (!layers.value) {
    var l = DEFAULT.LAYERS.split(",").filter(function (l) {
      return !!l;
    });
    for (let i = 0; i < l.length; i++) {
      const regex = /\(.*\)/gm;
      var id = l[i].replace(regex, "");
      var props = l[i].match(regex) || null;
      if (id) {
        addLayer(id, props);
      }
    }
  }
  /**
   * @type {*}
   * @description
   * La liste des contrôles
   * ex. Isocurve(1)
   */
  var controls = useStorage(ns('controls'), DEFAULT.CONTROLS, sessionStorage);
  if (!controls.value) {
    var c = DEFAULT.CONTROLS.split(",").filter(function (c) {
      return !!c;
    });
    for (let j = 0; j < c.length; j++) {
      addControl(c[j]);
    }
  }
  /**
   * @type {*}
   * @description
   * La liste des favoris
   * ex. https://data.geopf.fr/documents/1p2pDnXdwZfaCfsAkriU9UJBLO9vuKxb8M7Fna7iDrx4s1.bin?
   *    uuid=bb2903e4-4bee-4322-9fcf-de9a0d983490&
   *    name=Mon+croquis&
   *    description=export&
   *    format=kml&
   *    opacity=1&
   *    visible=1&
   *    grayscale=0
   */
  var bookmarks = useStorage(ns('bookmarks'), "", sessionStorage);
  if (!bookmarks.value) {
    bookmarks.value = "";
  } else {
    // HACK
    // on supprime les paramètres s=1
    // car ils sont devenus obsolètes à ce niveau là
    // et on ne les utilise plus dans l'url de partage
    bookmarks.value = bookmarks.value.replace(/%26s%3D1/g, "");
  }

  ///////////
  // watcher
  ///////////

  sessionStorage.setItem(ns('center'), center.value);
  sessionStorage.setItem(ns('permalink'), permalink.value);
  sessionStorage.setItem(ns('permalinkShare'), permalinkShare.value);

  watch(zoom, () => {
    sessionStorage.setItem(ns('zoom'), Math.round(zoom.value));
  })
  watch(x, () => {
    sessionStorage.setItem(ns('x'), x.value);
  })
  watch(y, () => {
    sessionStorage.setItem(ns('y'), y.value);
  })
  watch(lon, () => {
    sessionStorage.setItem(ns('lon'), lon.value);
  })
  watch(lat, () => {
    sessionStorage.setItem(ns('lat'), lat.value);
  })
  watch(layers, () => {
    sessionStorage.setItem(ns('layers'), layers.value.toString()); // string
  })
  watch(permalink, () => {
    sessionStorage.setItem(ns('permalink'), permalink.value.toString()); // string
  })
  watch(permalinkShare, () => {
    sessionStorage.setItem(ns('permalinkShare'), permalinkShare.value.toString()); // string
  })
  watch(center, () => {
    sessionStorage.setItem(ns('center'), center.value.toString()); // string
  })
  watch(firstVisit, () => {
    sessionStorage.setItem(ns('firstVisit'), firstVisit.value); // booleen
  })
  watch(controls, () => {
    sessionStorage.setItem(ns('controls'), controls.value.toString()); // string
  })
  watch(bookmarks, () => {
    sessionStorage.setItem(ns('bookmarks'), bookmarks.value.toString()); // string
  })
  watch(geolocation, () => {
    sessionStorage.setItem(ns('geolocation'), geolocation.value.toString()); // string
  })
  watch(noLoginInformation, () => {
    sessionStorage.setItem(ns('noLoginInformation'), noLoginInformation.value);
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
  function addLayer (id, props) {
    if (!id) {
      return;
    }
    if (getLayers().includes(id)) {
      return;
    }
    var l = (layers.value === "") ? [] : layers.value.split(",");
    l.push((props) ? id + props : id + "(-1;1;1;0)"); // options par defaut
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
          if (key === "position") {
            values[0] = value;
          }
          if (key === "opacity") {
            values[1] = value;
          }
          if (key === "visible") {
            values[2] = +value; // cast true -> 1 | false -> 0
          }
          if (key === "grayscale") {
            values[3] = +value; // cast true -> 1 | false -> 0
          }
          // INFO
          // property facultative
          // uniquement pour le TMS
          if (key === "style") {
            values[4] = value;
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
        position : Number(values[0]), // cast
        opacity : Number(values[1]), // cast 
        visible : !!Number(values[2]), // cast 1 -> true | 0 -> false
        grayscale : !!Number(values[3]), // cast 
        style : values[4] // facultatif
      };
    }
  }

  // Gestion des données utilisateurs : url de partage des favoris
  function getBookmarks () {
    return bookmarks.value.split(",").filter(name => name != '');
  }
  function getBookmarksByKey () {
    return bookmarks.value.split(",").map((b) => {
      return decodeURIComponent(b).split("?")[0];
    }).filter(name => name != ''); // array
  }
  function getBookmarksByID () {
    return bookmarks.value.split(",").map((b) => {
      var params = decodeURIComponent(b).split("?")[1];
      var p = new URLSearchParams(params);
      var id = p.get("i"); // uuid reduit
      if (!id) {
        // on ne peut pas utiliser le uuid car on l'a rendu facultatif
        // on utilise le nom du partage
        id = decodeURIComponent(b).split("?")[0].split(".")[0]; // lien de partage si pas de uuid
      }
      return id;
    }).filter(name => name != ''); // array
  }
  function addBookmark (url) {
    if (!url) {
      return;
    }
    var _url = decodeURIComponent(url).split("?")[0];
    if (getBookmarksByKey().includes(_url)) {
      return;
    }

    var b = (bookmarks.value === "") ? [] : bookmarks.value.split(",");
    var key = encodeURIComponent(url); // encode(url) en base64 ?
    b.push(key);
    bookmarks.value = b.toString(); // string
  }
  function removeBookmark (url) {
    var _url = decodeURIComponent(url).split("?")[0];
    const index = getBookmarksByKey().indexOf(_url);
    if (index !== -1) {
      var b = bookmarks.value.split(",");
      b.splice(index, 1);
      bookmarks.value = b.toString(); // string
    }
  }
  function removeBookmarkByID (id) {
    const index = getBookmarksByID().indexOf(id);
    if (index !== -1) {
      var b = bookmarks.value.split(",");
      b.splice(index, 1);
      bookmarks.value = b.toString(); // string
    }
  }
  function updateBookmark (url) {
    var _url = url.split("?")[0];
    const index = getBookmarksByKey().indexOf(_url);
    if (index !== -1) {
      var b = bookmarks.value.split(",");
      b[index] = encodeURIComponent(url); // encode(url) en base64 ?;
      bookmarks.value = b.toString(); // string
    }
  }
  function updateBookmarkPropertyByID (id, props) {
    const index = getBookmarksByID().indexOf(id);
    if (index !== -1) {
      var b = bookmarks.value.split(",");
      var _url = decodeURIComponent(b[index]);
      var p = new URLSearchParams(_url.split("?")[1]);
      for (const key in props) {
        if (Object.prototype.hasOwnProperty.call(props, key)) {
          const value = props[key];
          p.set(key, value);
        }
      }
      b[index] = encodeURIComponent(_url.split("?")[0] + "?" + p.toString());
      bookmarks.value = b.toString(); // string
    }
  }
  function getBookmarkProperty (url) {
    var params = {};
    const index = getBookmarksByKey().indexOf(url.split('?')[0]);
    if (index !== -1) {
      var p = new URLSearchParams(url.split('?')[1]);
      p.forEach((value, key) => {
        params[key] = value;
      });
    } 
    return params;
  }

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
    bookmarks,
    zoom,
    center,
    x,
    y,
    lon,
    lat,
    firstVisit,
    permalink,
    permalinkShare,
    geolocation,
    isPermalink,
    noLoginInformation,
    getMap,
    setMap,
    getLayers,
    cleanLayers,
    addLayer,
    removeLayer,
    updateLayerProperty,
    updateLayerPosition,
    getLayerProperty,
    getBookmarks,
    addBookmark,
    removeBookmark,
    removeBookmarkByID,
    updateBookmark,
    updateBookmarkPropertyByID,
    getBookmarkProperty,
    getControls,
    cleanControls,
    addControl,
    removeControl
  }
})