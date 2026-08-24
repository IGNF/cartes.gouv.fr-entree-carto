import { useUrlParams } from "@/composables/urlParams";
import { useMapStore } from "@/stores/mapStore";

import { toShare } from "@/features/share";

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
      store[key] = value;
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

// Ex. de permalien court :
// http://localhost:5173/cartes.gouv.fr-entree-carto/?permalink=short&sid=76Z6EzXAPQ

export const getShortPermalink = async (id) => {
  const store = useMapStore();
  var data = null;
  try {
    // Validate and sanitize the id parameter
    if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new Error("Invalid id parameter");
    }
    const baseUrl = new URL("https://data.geopf.fr/documents/");
    const documentUrl = new URL(`${baseUrl.pathname}${id}.json`, baseUrl.origin);
    const response = await fetch(documentUrl.toString());
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du permalien court : " + response.statusText);
    }
    data = await response.json();

    data.documents.layers.forEach((layer) => {
      store.addLayer(layer.id);
    });
    data.documents.bookmarks.forEach((bookmark) => {
      var url = toShare(bookmark, { 
          opacity: bookmark.opacity, 
          visible: bookmark.visible,
          grayscale: bookmark.grayscale,
          position: bookmark.position
        });
      store.addBookmark(url);
    });
    store["x"] = data.x;
    store["y"] = data.y;
    store["zoom"] = data.zoom;

    // HACK : on force un rafraichissement de la carte
    waitForMapReady(store).then((map) => {
      if (!map) {
        return;
      }
      const view = map.getView();
      view.setZoom(store.zoom);
      view.setCenter([store.x, store.y]);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du permalien court :", error);
  }
  return data;
};