import { useUrlSearchParams } from '@vueuse/core';
import { getDefaultControls, getOptsActiveControls } from '@/composables/controls';
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
 * - zoom : ...
 * - commentaire : "m" string avec contenu encodé
 * - titre : "t" string avec contenu encodé
 * - localisation : "g" boolean, ajout d'un icone
 * - informations : "i" boolean, ajout d'informations prédéfinies
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
          // FIXME utile ? la liste devrait être fixe...
          // var defaultControls = getActiveControls();
          params.sharedControls = getOptsActiveControls();
          params.defaultControls = getDefaultControls();
          params.controls = params.sharedControls + "," + params.defaultControls; 
          // + defaultControls;
          break;
        case "m":
          console.debug("not yet implemented !");
          break;
        case "t":
          console.debug("not yet implemented !");
          break;
        case "i":
          console.debug("not yet implemented !");
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