import { useUrlParams } from "@/composables/urlParams";
import { useMapStore } from "@/stores/mapStore";

// on ajoute le paramètre permalink=yes dans l'URL
const applyPermalink = () => {
  const params = new URLSearchParams(window.location.search);
  params.set('permalink', 'yes');
  window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
};

// on retire le paramètre permalink=yes de l'URL
const removePermalink = () => {
  const params = new URLSearchParams(window.location.search);
  params.delete('permalink');
  const newUrl = params.toString() 
  ? `${window.location.pathname}?${params.toString()}` 
  : window.location.pathname;
  window.history.pushState({}, '', newUrl);
}

/**
 * Lecture d'un permalien
 * Et, mise à jour du store de la carte !
 * @param {*} url - permalien
*/
export const getLayersFromPermalink = (url) => {
  const store = useMapStore();
  applyPermalink();
  // gestion des KVP dans l'URL (permalink)
  var params = useUrlParams(url);
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (key === 'permalink') {
        continue;
      }
      if (key === 'center') {
        continue;
      }
      store[key] = value; // reactive !
    }
  }
  // HACK : on force un rafraichissement de la carte
  setTimeout(() => {
    var map = store.map;
    map.getView().setZoom(store.zoom);
    map.getView().setCenter([store.x, store.y]);
    removePermalink();
  },100);
};