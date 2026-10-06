/** Suppression complète du localStorage */
const clearAllItems = false;

/** 
 * Liste des clefs à nettoyer par thème
 * - clean : indique si les clefs doivent être nettoyées ou non.
 * - ns : indique si les clefs sont préfixées par un namespace.
 * - value : liste des clefs à supprimer.
 * 
 * @fixme impossible de nettoyer certaines clefs comme les logs !
 * @fixme pourquoi nettoyer les customisations clientes ? ex. noLoginInformation ou vue-dsfr-scheme
 */
const items = {
  view : {
    clean : true,
    ns : true,
    value : ["center", "geolocation", "x", "y", "zoom", "lon", "lat", "permalink", "permalinkShare"]
  },
  layers :  {
    clean : true,
    ns : true,
    value : ["layers", "bookmarks"],
  },
  widgets :  {
    clean : true,
    ns : true,
    value : ["controls"],
  },
  logs :  {
    clean : true,
    ns : false,
    value : ["loglevel:*"],
  },
  service :  {
    clean : true,
    ns : false,
    value : ["service"], // "noLoginInformation" ?
  },
  territories :  {
    clean : false,
    ns : true,
    value : ["territories"],
  },
  theme :  {
    clean : false,
    ns : true,
    value : ["isHeaderCompact"] // "vue-dsfr-scheme" ?
  }
};

/**
 * Nettoie le localStorage en fonction d'un préfixe donné.
 * ex. "loglevel:*"
 * @param {string} prefix - Le préfixe des clefs à supprimer du localStorage.
 */
const clearLocalStorageByPrefix = (prefix) => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => localStorage.removeItem(key));
}

/**
 * Nettoie le localStorage en fonction de la configuration.
 * - Si clearAllItems = true, tout le localStorage est effacé.
 * - Sinon, seules les clefs spécifiées dans items sont vidées.
 * @param {string} namespace - Le préfixe à utiliser pour les clefs du localStorage.
 */
export function useClearStorage(namespace) {
  if (clearAllItems) {
    localStorage.clear();
  } else {
    for (const key in items) {
      if (items[key] && items[key].clean) {
        items[key].value.forEach((item) => {
          if (items[key].ns) {
            localStorage.removeItem(namespace + '.' + item);
          } else {
            if (item.includes('*')) {
              clearLocalStorageByPrefix(item.replace('*', ''));
            } else {
              localStorage.removeItem(item);
            }
          }
        });
      }
    }
  }
}