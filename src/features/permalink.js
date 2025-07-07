import { useUrlParams } from "@/composables/urlParams";
import { useMapStore } from "@/stores/mapStore";

/**
 * Lecture d'un permalien
 * Et, mise à jour du store de la carte !
 * @param {*} url - permalien
*/
export const getLayersFromPermalink = (url) => {
  const store = useMapStore();
  var lon = null;
  var lat = null;
  // gestion des KVP dans l'URL (permalink)
  var params = useUrlParams(url);
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (key === 'center') {
        continue;
      }
      if (key === 'permalink') {
        continue;
      }
      // HACK : on deporte la maj du centre plus bas
      // afin d'eviter trop de update du store !
      if (key === 'lon') {
        lon = value;
        continue;
      }
      if (key === 'lat') {
        lat = value;
        continue;
      }
      store[key] = value; // reactive !
    }
  }
  // HACK : on force un rafraichissement de la carte
  setTimeout(() => {
    var map = store.map;
    store.center = [lon, lat];
    map.getView().setZoom(store.zoom);
    map.getView().setCenter([store.x, store.y]);
  },0);
};