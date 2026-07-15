/* eslint-disable secure-coding/detect-object-injection -- clé filtrée car accès restreint par whitelist explicite via switch */
import { useUrlSearchParams } from '@vueuse/core';
import {
  fromLonLat as fromLonLatProj
} from "ol/proj";
// import { useDefaultControls } from '@/composables/controls';

/**
 * Lecture du permalink pour y extraire les informations.
 * La structure est identique au permalien de la carte
 * avec quelques paramètres supplementaires :
 * - centre : ...
 * - x / y : ...
 * - lon / lat : ...
 * - layers : ... 
 * - bookmarks : ...
 * - controls : ...
 * - zoom : ...
 * - geolocation : ...
 * - permalink : yes | no
 * - redirect : url de redirection
 * 
 * @example
 * http://localhost:5173/cartes.gouv.fr-entree-carto/embed?
 * &c=-4.088682731825065,47.99263846894371
 * &z=10
 * &l=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;0),ACCES.BIOMETHANE$GEOPORTAIL:OGC:WMTS(0.47;1;0)
 * &d=https://data.geopf.fr/documents/1p2pDnXdwZfaCfsAkriU9UJBLO9vuKxb8M7Fna7iDrx4s1.bin?uuid=bb2903e4-4bee-4322-9fcf-de9a0d983490&name=Mon+croquis&description=export&format=kml&opacity=1&visible=1&grayscale=0
 * &permalink=yes
 * 
 * @see mapStore
 */
export function useUrlParams(url) {
  var params = {};
  var urlParams = {};
  if (url) {
    const _url = new URL(url);
    const _urlSearchParams = new URLSearchParams(_url.search);
    /* eslint-disable-next-line secure-coding/no-unchecked-loop-condition -- la whitelist explicitevia le switch ecarte les clefs */
    for (const [key, value] of _urlSearchParams.entries()) {
      urlParams[key] = value;
    }
  } else {
    urlParams = useUrlSearchParams("history");
  }
  if (urlParams) {
    try {
      const keys = Object.keys(urlParams);
      /* eslint-disable-next-line secure-coding/no-unchecked-loop-condition -- la whitelist via switch contrôle les paramètres acceptés */
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        switch (key) {
          case "c":
            var lonlat = urlParams[key].split(",");
            if (lonlat.length !== 2) {
              throw new Error(`Le paramètre 'c' du permalien est invalide : ${urlParams[key]} !`);
            }
            params.lon = parseFloat(lonlat[0]);
            params.lat = parseFloat(lonlat[1]);
            var xy = fromLonLatProj([params.lon, params.lat]);
            if (!xy || xy.length !== 2) {
              throw new Error(`Le paramètre 'c' du permalien est invalide : ${urlParams[key]} !`);
            }
            params.x = xy[0];
            params.y = xy[1];
            params.center = [params.lon, params.lat];
            break;
          case "l":
            // on ne traite pas le param "l", le store de la carte s'en charge
            params.layers = urlParams[key];
            break;
          case "w":
            // on ne traite plus le param "w" = pas de changement des outils en chargeant un permalink
            // params.controls = urlParams[key] + "," + useDefaultControls().toString();
            break;
          case "d":
            // on ne traite pas le param "d", le store de la carte s'en charge
            params.bookmarks = urlParams[key];
            break;
          case "z":
            params.zoom = parseInt(urlParams[key], 10);
            break;
          case "p":
            var geolocation = urlParams[key].split(",");
            if (geolocation.length !== 2) {
              throw new Error(`Le paramètre 'p' du permalien est invalide : ${urlParams[key]} !`);
            }
            params.geolocation = [parseFloat(geolocation[0]), parseFloat(geolocation[1])];
            break;
          case "geolocation":
            params.geolocation = urlParams[key];
            break;
          case "permalink":
            var permalink = urlParams[key].toLowerCase();
            if (permalink !== "yes" && permalink !== "no") {
              throw new Error(`Le paramètre 'permalink' du permalien est invalide : ${urlParams[key]} !`);
            }
            params.permalink = permalink; // yes | no
            break;
          case "redirect":
            params.redirect = urlParams[key]; // url de redirection
            break;
          default:
            break;
        }
      }
    } catch (error) {
      throw new Error(`Erreur de parsing du permalien : ${error.message} !`);
    }
  }
  return params;
};