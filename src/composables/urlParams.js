import { useUrlSearchParams } from '@vueuse/core';

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
 * &c=417070.66959457495,5975301.705064449
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
          var xy = urlParams[key].split(",");
          params.x = xy[0];
          params.y = xy[1];
          params.lon = 0; // on ne fait pas la conversion...
          params.lat = 0;
          params.center = [params.x, params.y];
          break;
        case "l":
          params.layers = urlParams[key];
          break;
        case "w":
          // FIXME utile ? la liste devrait être fixe...
          params.controls = urlParams[key];
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