import { useUrlParams } from "@/composables/urlParams";
import { useMapStore } from "@/stores/mapStore";

const waitForMapReady = (store, maxAttempts = 30, interval = 100) => {
  return new Promise((resolve) => {
    let attempts = 0;
    const timer = setInterval(() => {
      const map = store.getMap();
      if (map && typeof map.getView === 'function' && map.getView()) {
        clearInterval(timer);
        resolve(map);
        return;
      }

      attempts += 1;
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        resolve(null);
      }
    }, interval);
  });
};

/** 
 * Ajoute le paramètre permalink=yes dans l'URL
 */
export const addPermalink = () => {
  const params = new URLSearchParams(window.location.search);
  params.set('permalink', 'yes');
  var newUrlwithParam = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrlwithParam);
};

/**
 * Retire le paramètre permalink=yes de l'URL
 */
export const removePermalink = () => {
  const params = new URLSearchParams(window.location.search);
  params.delete('permalink');
  const newUrlwithoutParam = params.toString() 
  ? `${window.location.pathname}?${params.toString()}` 
  : window.location.pathname;
  window.history.pushState({}, '', newUrlwithoutParam);
}

/**
 * Lecture d'un permalien
 * Et, mise à jour du store de la carte !
 * @param {*} url - permalien
*/
export const getLayersFromPermalink = (url) => {
  const store = useMapStore();
  addPermalink();
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
  waitForMapReady(store).then((map) => {
    if (!map) {
      return;
    }
    const view = map.getView();
    view.setZoom(store.zoom);
    view.setCenter([store.x, store.y]);
  });
};