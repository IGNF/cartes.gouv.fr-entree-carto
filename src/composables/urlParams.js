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
 * - controls : ...
 * - zoom : ...
 * 
 * @example
 * http://localhost:5173/cartes.gouv.fr-entree-carto/embed?
 * &c=-4.088682731825065,47.99263846894371
 * &z=10
 * &l=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;0),ACCES.BIOMETHANE$GEOPORTAIL:OGC:WMTS(0.47;1;0)
 * &permalink=yes
 * 
 * @see mapStore
 */
export function useUrlParams() {
  var params = {};
  const urlParams = useUrlSearchParams("history");
  if (urlParams) {
    const keys = Object.keys(urlParams);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      switch (key) {
        case "c":
          var lonlat = urlParams[key].split(",");
          params.lon = lonlat[0];
          params.lat = lonlat[1];
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
        case "z":
          params.zoom = parseInt(urlParams[key], 10);
          break;
        default:
          break;
      }
    }
  }
  return params;
};