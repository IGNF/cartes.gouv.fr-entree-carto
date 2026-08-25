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
 * Ajoute le paramètre permalink=short dans l'URL
 */
export const addShortPermalink = () => {
  const params = new URLSearchParams(window.location.search);
  params.set('permalink', 'short');
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
};

/**
 * Lecture d'un permalien classique
 * Et, mise à jour du store de la carte !
 * @param {*} url - L'URL du permalien
*/
export const loadPermalink = (url) => {
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

/**
 * Chargement d'un permalien court
 * à partir de l'identifiant de partage
 * @param {*} sid - identifiant de partage du permalien court
 * @returns {Promise} - Le contenu du fichier
 * @example
 * http://localhost:5173/cartes.gouv.fr-entree-carto/?permalink=short&sid=76Z6EzXAPQ
 */
export const loadShortPermalink = async (sid) => {
  var data = null;
  try {
    // Validate and sanitize the sid parameter
    if (!sid || typeof sid !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(sid)) {
      throw new Error("Invalid sid parameter");
    }
    const baseUrl = new URL("https://data.geopf.fr/documents/"); // FIXME production uniquement !
    const documentUrl = new URL(`${baseUrl.pathname}${sid}.json`, baseUrl.origin);
    data = await getShortPermalinkDocument(documentUrl.toString());

  } catch (error) {
    throw new Error("Erreur lors de la récupération du permalien court : " + error.message);
  }
  return data;
};

/**
 * Récupération du contenu d'un document partagé (permalink court)
 * @param {string} public_url - L'URL publique du document partagé
 * @returns {Promise} - Le contenu du fichier
 */
const getShortPermalinkDocument = async (public_url) => {
  var data = null;
  if (!public_url || typeof public_url !== 'string') {
    throw new Error("Invalid public_url parameter");
  }
  try {
    const response = await fetch(public_url);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du permalien court : " + response.statusText);
    }
    data = await response.json();

    setShortPermalinkData(data);

  } catch (error) {
    throw new Error("Erreur lors de la récupération du permalien court : " + error.message);
  }
  return data;
};

/**
 * Mise à jour du store de la carte à partir des données d'un permalien court
 * @param {Object} data - Les données du permalien court
 */
export const setShortPermalinkData = (data) => {
  const store = useMapStore();
  addShortPermalink();
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
};