import { useUrlParams } from "@/composables/urlParams";
import { useMapStore } from "@/stores/mapStore";

/**
 * Lecture d'un permalien
 * Et, mise à jour du store de la carte !
 * @param {*} url - permalien
 */
export const getLayersFromPermalink = (url) => {
  const store = useMapStore();
  // gestion des KVP dans l'URL (permalink)
  var params = useUrlParams(url);
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (key !== "center") {
        const value = params[key];
        store[key] = value; // reactive !
      }
    }
  }
  // HACK : on force un rafraichissement de la carte
  setTimeout(() => {
    var map = store.map;
    map.getView().setZoom(store.zoom);
    map.getView().setCenter([store.x, store.y]);
  },0);
};