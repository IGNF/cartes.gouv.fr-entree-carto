import { useUrlSearchParams } from '@vueuse/core';
import {
  fromLonLat as fromLonLatProj
} from "ol/proj";

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
    for (const [key, value] of _urlSearchParams.entries()) {
      urlParams[key] = value;
    }
  } else {
    urlParams = useUrlSearchParams("history");
  }
  if (urlParams) {
    try {
      const keys = Object.keys(urlParams);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        switch (key) {
          case "c":
            var lonlat = urlParams[key].split(",");
            params.lon = parseFloat(lonlat[0]);
            params.lat = parseFloat(lonlat[1]);
            var xy = fromLonLatProj(lonlat);
            params.x = xy[0];
            params.y = xy[1];
            params.center = [params.lon, params.lat];
            break;
          case "l":
            params.layers = urlParams[key];
            break;
          case "w":
            params.controls = urlParams[key];
            break;
          case "d":
            params.bookmarks = urlParams[key];
            break;
          case "z":
            params.zoom = parseInt(urlParams[key], 10);
            break;
          case "p":
            params.geolocation = urlParams[key];
            break;
          case "permalink":
            params.permalink = urlParams[key]; // yes | no
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